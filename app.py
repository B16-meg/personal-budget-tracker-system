# app.py
from flask import Flask, render_template, request, jsonify
import json, os
from datetime import datetime
import webbrowser
import threading

app = Flask(__name__)

DATA_FILE = 'data.json'

# Ensure data file exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

def load_transactions():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_transactions(transactions):
    with open(DATA_FILE, 'w') as f:
        json.dump(transactions, f, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/transactions')
def get_transactions():
    return jsonify(load_transactions())

@app.route('/add', methods=['POST'])
def add_transaction():
    transaction = request.get_json()
    transaction['id'] = int(datetime.now().timestamp() * 1000)  # ✅ safer unique ID
    transactions = load_transactions()
    transactions.append(transaction)
    save_transactions(transactions)
    return jsonify({'status': 'success', 'id': transaction['id']})  # send back the ID

@app.route('/delete/<int:tx_id>', methods=['DELETE'])
def delete_transaction(tx_id):
    transactions = load_transactions()
    transactions = [tx for tx in transactions if tx['id'] != tx_id]
    save_transactions(transactions)
    return jsonify({'status': 'deleted'})

@app.route('/edit/<int:tx_id>', methods=['PUT'])
def edit_transaction(tx_id):
    updated_data = request.get_json()
    transactions = load_transactions()
    for tx in transactions:
        if tx['id'] == tx_id:
            tx.update(updated_data)
            save_transactions(transactions)
            return jsonify({'status': 'updated'})
    return jsonify({'status': 'not found'}), 404

def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")

if __name__ == '__main__':
    threading.Timer(1.5, open_browser).start()
    app.run()
