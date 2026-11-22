from flask import Flask, abort, render_template, request, send_from_directory


app = Flask(__name__, static_folder=None, template_folder=".")
app.config["TEMPLATES_AUTO_RELOAD"] = True

STATIC_FILES = {
    "style.css",
    "main.js",
    "malta-guinness-bottle.png",
    "malta-guinness-can.jpg",
    "malta-guinness-logo.png",
    "malta-guinness-product.png",
}


@app.route("/static/<path:filename>", endpoint="static")
def static_files(filename):
    asset_name = filename.rsplit("/", 1)[-1]
    if asset_name not in STATIC_FILES:
        abort(404)
    return send_from_directory(app.root_path, asset_name)


@app.route("/")
def home():
    return render_template("home.html", page="home")


@app.route("/our-story")
def story():
    return render_template("story.html", page="story")


@app.route("/products")
def products():
    return render_template("products.html", page="products")


@app.route("/ghana")
def ghana():
    return render_template("ghana.html", page="ghana")


@app.route("/find-us")
def find_us():
    return render_template("find_us.html", page="find_us")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        return render_template(
            "contact.html",
            page="contact",
            sent=False,
            notice="This demo form is not connected to a customer-service inbox yet.",
        )
    return render_template("contact.html", page="contact", sent=False, notice=None)


@app.route("/privacy")
def privacy():
    return render_template("legal.html", page="privacy", legal_page="privacy")


@app.route("/terms")
def terms():
    return render_template("legal.html", page="terms", legal_page="terms")


if __name__ == "__main__":
    import os

    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "3000")))
