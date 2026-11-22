from flask import Flask, render_template, request


app = Flask(__name__, static_folder="public", static_url_path="/static")
app.config["TEMPLATES_AUTO_RELOAD"] = True


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
    app.run(debug=True)