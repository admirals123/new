from flask import Flask, request, jsonify
import redis

app = Flask(__name__)

# Connect to Redis
client = redis.Redis(
    host='redis-demo-karthik.redis.cache.windows.net',
    port=6379,
    password='r7X4oyXOB3euMeEq6Ts19ako6ef8zfRbLAzCaHyvGZQ='
)

# Function to set a value in Redis
def set_value(key, value):
    try:
        client.set(key, value)
        print(f"Value '{value}' set for key '{key}' in Redis")
        return 'Value set successfully in Redis'
    except Exception as e:
        print(e)
        return 'Error setting value in Redis'

# Function to get a value from Redis
def get_value(key):
    try:
        result = client.get(key)
        if result:
            result = result.decode('utf-8')
            print(f"Value for key '{key}' in Redis: {result}")
            return f"Value for key '{key}' in Redis: {result}"
        else:
            return f"No value found for key '{key}' in Redis"
    except Exception as e:
        print(e)
        return 'Error getting value from Redis'

# Route to set a value in Redis
@app.route('/set', methods=['POST'])
def set_route():
    data = request.get_json()
    key = data.get('key')
    value = data.get('value')
    return set_value(key, value)

# Route to get a value from Redis
@app.route('/get/<key>', methods=['GET'])
def get_route(key):
    return get_value(key)

if __name__ == '__main__':
    app.run(port=3000)
