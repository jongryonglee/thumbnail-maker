from flask import Blueprint, request, jsonify, current_app
import requests
import time

generate_thumbnail = Blueprint('generate_thumbnail', __name__)

MONSTER_API_URL = "https://api.monsterapi.ai/v1/generate/txt2img"
FETCH_RESULTS_API_URL = "https://api.monsterapi.ai/v1/status"


@generate_thumbnail.route('/api/generate-thumbnail', methods=['POST'])
def generate_thumbnail_api():
    data = request.json
    video_description = data.get('videoDescription')
    design_description = data.get('designDescription')
    color_scheme = data.get('colorScheme')

    payload = {
        "prompt": f"{video_description}, {design_description}, {color_scheme}",
        "aspect_ratio": "square",
        "guidance_scale": 7.5,
        "safe_filter": True,
        "samples": 1,
        "steps": 50,
        "style": "anime"
    }

    API_KEY = current_app.config['API_KEY']

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(MONSTER_API_URL, json=payload, headers=headers)
        response_data = response.json()

        process_id = response_data.get('process_id')
        if not process_id:
            return jsonify({"error": "Failed to generate image"}), 400

        time.sleep(5)
        fetch_response = requests.get(f"{FETCH_RESULTS_API_URL}/{process_id}", headers=headers)
        fetch_data = fetch_response.json()

        image_url = fetch_data.get('image_url')
        if not image_url:
            return jsonify({"error": "Image generation failed"}), 400

        return jsonify({"imageUrl": image_url}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
