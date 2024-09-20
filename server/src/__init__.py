from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import os

def create_app():
    load_dotenv()  # .envファイルから環境変数を読み込む
    app = Flask(__name__)

    CORS(app, supports_credentials=True)

    # 設定の読み込み
    app.config['API_KEY'] = os.getenv('API_KEY')

    from .api.routes import generate_thumbnail
    app.register_blueprint(generate_thumbnail)

    return app
