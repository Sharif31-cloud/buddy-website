import time
import requests
import uuid
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, db

# -----------------------------
# CONFIG
# -----------------------------
TELEGRAM_BOT_TOKEN = "8027721063:AAGgsvFKP6doCpgRZKZxe_iUPCeFV2OQVHM"
TELEGRAM_CHAT_ID = "-1003880872080"

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://signalhawksubs-default-rtdb.firebaseio.com/"
})

SUBSCRIPTION_PACKAGES = {
    "DAY": {"days": 1, "label": "1 Day"},
    "WEEK": {"days": 7, "label": "1 Week"},
    "MONTH": {"days": 30, "label": "1 Month"}
}

# -----------------------------
# HELPERS
# -----------------------------
def sanitize_email(email: str) -> str:
    return email.replace('.', ',').replace('@', '_at_')

def activate_subscription(email: str, days: int):
    safe_email = sanitize_email(email)
    ref = db.reference(f"subscriptions/{safe_email}")
    data = ref.get()

    if not data:
        raise ValueError("Email not registered")

    license_key = uuid.uuid4().hex
    expiry = (datetime.utcnow() + timedelta(days=days)).isoformat()

    ref.update({
        "key": license_key,
        "paid": True,
        "active": True,
        "expiry": expiry
    })

    return license_key, expiry

def approve_txn(txn_id: str, package_name: str):
    ref = db.reference(f"verification_requests/{txn_id}")
    data = ref.get()

    if not data or data.get("status") != "PENDING":
        return False, "Invalid or already processed"

    days = SUBSCRIPTION_PACKAGES[package_name]["days"]
    key, expiry = activate_subscription(data["email"], days)

    ref.update({
        "status": "APPROVED",
        "package": package_name,
        "license_key": key,
        "expiry": expiry,
        "verified_at": datetime.utcnow().isoformat()
    })

    return True, f"✅ Approved: {package_name}\n⏳ Expires: {expiry}\n🔑 {key}"

def reject_txn(txn_id: str, reason="Rejected by admin"):
    ref = db.reference(f"verification_requests/{txn_id}")
    data = ref.get()

    if not data or data.get("status") != "PENDING":
        return False, "Invalid or already processed"

    ref.update({
        "status": "REJECTED",
        "reason": reason,
        "verified_at": datetime.utcnow().isoformat()
    })

    return True, "Rejected successfully"

def send_telegram_message(chat_id, text):
    requests.post(
        f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
        json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
    )

# -----------------------------
# TELEGRAM POLLING
# -----------------------------
def get_latest_update_id():
    try:
        r = requests.get(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates",
            params={"limit": 1, "offset": -1},
            timeout=10
        )
        data = r.json().get("result", [])
        if data:
            return data[0]["update_id"] + 1
    except:
        pass
    return None

def run_bot():
    offset = None
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"

    print("Telegram listener running...")
    while True:
        try:
            if offset is None:
                offset = get_latest_update_id() or 0

            r = requests.get(url, params={"offset": offset, "timeout": 30}, timeout=35)
            updates = r.json().get("result", [])

            for update in updates:
                offset = update["update_id"] + 1
                callback = update.get("callback_query")
                if not callback:
                    continue

                chat_id = str(callback["message"]["chat"]["id"])
                if chat_id != TELEGRAM_CHAT_ID:
                    continue

                data = callback["data"]
                parts = data.split("|")
                response = {"ok": False, "msg": "Unknown action"}

                if parts[0] == "APPROVE":
                    _, package, txn_id = parts
                    response["ok"], response["msg"] = approve_txn(txn_id, package)
                elif parts[0] == "REJECT":
                    _, txn_id = parts
                    response["ok"], response["msg"] = reject_txn(txn_id)

                # Send response back to Telegram
                send_telegram_message(chat_id, f"📄 Txn `{parts[-1]}`\n\n{response['msg']}")

        except Exception as e:
            print("Telegram polling error:", e)
            offset = None
            time.sleep(5)
            continue

        time.sleep(2)

if __name__ == "__main__":
    run_bot()
