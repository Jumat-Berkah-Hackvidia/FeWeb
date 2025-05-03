import psycopg2
from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database connection setup
def get_db_connection():
    conn = psycopg2.connect(
        dbname="db_aidorse", 
        user="db_aidorse_owner", 
        password="npg_FkWrY1yMdO7e", 
        host="ep-jolly-wave-a1jwf3bn-pooler.ap-southeast-1.aws.neon.tech"
    )
    return conn

#------------------artist-----------------------#
# Create Artist
@app.route('/artists', methods=['POST'])
def create_artist():
    data = request.get_json()

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO artists (full_name, instagram_followers, instagram_username, tiktok_followers, tiktok_username, 
                             youtube_subscribers, youtube_username, location, price_range, endorsements_completed, rating, 
                             phone_number, email, profile_picture, marketing_methods, price_reels, price_live, price_story, 
                             price_posts, content_categories)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING artist_id, created_at, updated_at;
    """, (
        data['full_name'], data['instagram_followers'], data['instagram_username'], data['tiktok_followers'], 
        data['tiktok_username'], data['youtube_subscribers'], data['youtube_username'], data['location'], 
        data['price_range'], data['endorsements_completed'], data['rating'], data['phone_number'], data['email'], 
        data['profile_picture'], data['marketing_methods'], data['price_reels'], data['price_live'], data['price_story'], 
        data['price_posts'], data['content_categories']
    ))

    artist_id, created_at, updated_at = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        'artist_id': artist_id,
        'created_at': created_at,
        'updated_at': updated_at
    }), 201

# Get Artists
@app.route('/artists', methods=['GET'])
def get_artists():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT artist_id, full_name, instagram_followers, instagram_username, tiktok_followers, tiktok_username, 
               youtube_subscribers, youtube_username, location, price_range, endorsements_completed, rating, 
               phone_number, email, profile_picture, marketing_methods, price_reels, price_live, price_story, 
               price_posts, content_categories, created_at, updated_at
        FROM artists;
    """)

    artists = cur.fetchall()
    cur.close()
    conn.close()

    artist_list = []
    for artist in artists:
        artist_dict = {
            'artist_id': artist[0],
            'full_name': artist[1],
            'instagram_followers': artist[2],
            'instagram_username': artist[3],
            'tiktok_followers': artist[4],
            'tiktok_username': artist[5],
            'youtube_subscribers': artist[6],
            'youtube_username': artist[7],
            'location': artist[8],
            'price_range': artist[9],
            'endorsements_completed': artist[10],
            'rating': artist[11],
            'phone_number': artist[12],
            'email': artist[13],
            'profile_picture': artist[14],
            'marketing_methods': artist[15],
            'price_reels': artist[16],
            'price_live': artist[17],
            'price_story': artist[18],
            'price_posts': artist[19],
            'content_categories': artist[20],
            'created_at': artist[21],
            'updated_at': artist[22]
        }
        artist_list.append(artist_dict)

    return jsonify(artist_list)

# Update Artist
@app.route('/artists/<int:id>', methods=['PUT'])
def update_artist(id):
    data = request.get_json()

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE artists
        SET full_name = %s, instagram_followers = %s, instagram_username = %s, tiktok_followers = %s, 
            tiktok_username = %s, youtube_subscribers = %s, youtube_username = %s, location = %s, 
            price_range = %s, endorsements_completed = %s, rating = %s, phone_number = %s, email = %s, 
            profile_picture = %s, marketing_methods = %s, price_reels = %s, price_live = %s, price_story = %s, 
            price_posts = %s, content_categories = %s
        WHERE artist_id = %s
        RETURNING updated_at;
    """, (
        data['full_name'], data['instagram_followers'], data['instagram_username'], data['tiktok_followers'], 
        data['tiktok_username'], data['youtube_subscribers'], data['youtube_username'], data['location'], 
        data['price_range'], data['endorsements_completed'], data['rating'], data['phone_number'], data['email'], 
        data['profile_picture'], data['marketing_methods'], data['price_reels'], data['price_live'], data['price_story'], 
        data['price_posts'], data['content_categories'], id
    ))

    updated_at = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        'artist_id': id,
        'updated_at': updated_at
    })

# Delete Artist
@app.route('/artists/<int:id>', methods=['DELETE'])
def delete_artist(id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM artists WHERE artist_id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()

    return '', 204


#--------------------- business_owners ---------------------#

# Create Business Owner
# Create Account
# --------------------- Login --------------------- #

@app.route('/accounts/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Debugging: Print the received email and password
    print(f"Received email: {email}")
    print(f"Received password: {password}")

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Fetch the user with the provided email
        cur.execute("SELECT * FROM accounts WHERE email = %s", (email,))
        user = cur.fetchone()

        # Debugging: Print the user fetched from the database
        print(f"Fetched user: {user}")

        if user and user[3] == password:  # user[3] corresponds to the password column in the table
            # If login is successful, return the user details
            return jsonify({
                'account_id': user[0],  # account_id (user[0]) is returned
                'name': user[1],         # user name
                'email': user[2]         # user email
            }), 200  # 200 OK
        else:
            # Invalid credentials
            return jsonify({'error': 'Invalid credentials'}), 401  # 401 Unauthorized

    except Exception as e:
        conn.rollback()
        print(f"Error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500  # Internal Server Error

    finally:
        cur.close()
        conn.close()
@app.route('/accounts', methods=['POST'])
def create_account():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO accounts (name, email, password)
            VALUES (%s, %s, %s)
            RETURNING account_id, created_at, updated_at;
        """, (name, email, password))

        account_id, created_at, updated_at = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            'account_id': account_id,
            'created_at': created_at,
            'updated_at': updated_at
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500

# Get Accounts
@app.route('/accounts', methods=['GET'])
def get_accounts():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT account_id, name, email, password, created_at, updated_at
        FROM accounts;
    """)

    accounts = cur.fetchall()
    cur.close()
    conn.close()

    account_list = []
    for account in accounts:
        account_dict = {
            'account_id': account[0],
            'name': account[1],
            'email': account[2],
            'password': account[3],
            'created_at': account[4],
            'updated_at': account[5]
        }
        account_list.append(account_dict)

    return jsonify(account_list)

# Update Account
@app.route('/accounts/<int:id>', methods=['PUT'])
def update_account(id):
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            UPDATE accounts
            SET name = %s, email = %s, password = %s
            WHERE account_id = %s
            RETURNING updated_at;
        """, (name, email, password, id))

        updated_at = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            'account_id': id,
            'updated_at': updated_at
        })

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500

# Delete Account
@app.route('/accounts/<int:id>', methods=['DELETE'])
def delete_account(id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM accounts WHERE account_id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()

    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
