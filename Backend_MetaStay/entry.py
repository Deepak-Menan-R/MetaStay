import sqlite3
import csv

def create_database():
    conn = sqlite3.connect('hotels.db')
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS hotels (
                        id INTEGER PRIMARY KEY,
                        name TEXT,
                        country TEXT,
                        street TEXT,
                        region TEXT,
                        rating REAL,
                        reviews TEXT,
                        amenities TEXT,
                        rooms TEXT,
                        types TEXT,
                        price REAL,
                        official_description TEXT
                    )''')
    
    conn.commit()
    conn.close()

def insert_data_from_csv():
    conn = sqlite3.connect('hotels.db')
    cursor = conn.cursor()

    print("opening")
    with open('Hotel_Features_Dataset.csv', 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)
        for row in csv_reader:
            cursor.execute('''INSERT INTO hotels (name, country, street, region, rating, reviews, amenities, rooms, types, price, official_description)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', row[1:])


    conn.commit()
    conn.close()


# Main function
def main():
    create_database()
    print("db done,")
    insert_data_from_csv()
    print("Data inserted successfully.")

if __name__ == "__main__":
    main()
