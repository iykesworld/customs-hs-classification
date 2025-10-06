from app.__init__ import create_app

app = create_app()

if __name__ == '__main__':
    # Run the app in debug mode. It will automatically reload on code changes.
    app.run(debug=True, port=5000)