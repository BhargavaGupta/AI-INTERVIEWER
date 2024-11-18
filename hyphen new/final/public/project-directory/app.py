from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import string

app = Flask(__name__)

# Route to serve the index.html file
@app.route('/')
def bhargav():
    return render_template('bhargav.html')

# Function to generate User ID and password
def generate_user_id():
    return str(random.randint(100000000, 999999999))

def generate_password():
    uppercase_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    lowercase_letters = uppercase_letters.lower()
    digits = "0123456789"
    symbols = "()[]{},;:.-_/\\?+*#"
    
    all_letters_and_digits = uppercase_letters + lowercase_letters + digits

    password = ''.join(random.choice(all_letters_and_digits) for _ in range(19))
    special_char = random.choice(symbols)
    insert_pos = random.randint(0, 19)
    password = password[:insert_pos] + special_char + password[insert_pos:]
    
    return password

# Function to send credentials via email
def send_credentials_email(recipient_email, user_id, password):
    sender_email = "hyphenai9@gmail.com"
    sender_password = "prhg brnv vlwg darb"
    smtp_server = 'smtp.gmail.com'
    smtp_port = 465

    subject = "Your Candidate Credentials"
    body = f"""
    Hello,

    Below are your login details for the system:

    User ID: {user_id}
    Password: {password}

    Please keep this information secure and do not share it with anyone.

    Best regards,
    Hyphen AI.
    """
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        return "Email sent successfully!"
    except Exception as e:
        return f"Error: {e}"

# Route to handle sending email
@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    recipient_email = data.get('email')
    
    user_id = generate_user_id()
    password = generate_password()
    
    result = send_credentials_email(recipient_email, user_id, password)
    return jsonify({"message": result, "user_id": user_id, "password": password})

if __name__ == "__main__":
    app.run(debug=True)
