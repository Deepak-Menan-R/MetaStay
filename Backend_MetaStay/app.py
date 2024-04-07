from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def connect_db():
    conn = sqlite3.connect('hotels.db')
    return conn

@app.route('/get-hotels', methods=['GET'])
def get_hotels():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM hotels')
    columns = [col[0] for col in cursor.description]
    properties = cursor.fetchall()
    conn.close()
    hotels_list = []
    for row in properties:
        hotel = {}
        for i in range(len(columns)):
            hotel[columns[i]] = row[i]
        hotels_list.append(hotel)
    return jsonify(hotels_list)


@app.route('/hotels', methods=['GET'])
def hotels():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM hotels LIMIT 15')
    columns = [col[0] for col in cursor.description]
    properties = cursor.fetchall()
    conn.close()
    hotels_list = []
    for row in properties:
        hotel = {}
        for i in range(len(columns)):
            hotel[columns[i]] = row[i]
        hotels_list.append(hotel)
    return jsonify(hotels_list)

@app.route('/hotel/<int:id>', methods=['GET'])
def get_hotel(id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM hotels WHERE id  = ?', (id,))
    hotel_data = cursor.fetchone()
    conn.close()
    if hotel_data:
        columns = [col[0] for col in cursor.description]
        hotel_dict = {}
        for i in range(len(columns)):
            hotel_dict[columns[i]] = hotel_data[i]
        return jsonify(hotel_dict)
    else:
        return jsonify({'error': 'Property not found'}), 404
    
if __name__ == "__main__":
    app.run(debug=True)