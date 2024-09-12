import "./style.css";

export default function App() {
  function Submit(e) {
    e.preventDefault(); // Prevent default form submission

    const formEle = document.querySelector("form");
    const formData = new FormData(formEle);

    fetch(
      "https://script.google.com/macros/s/AKfycbw4oWREeLer75uJiBcdxc9l8dsu9ECKhj1ADjMMZ0QC1scFi6DHBQ6Ttz1sSOkSs90Xqw/exec",
      {
        method: "POST",
        body: formData
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <h1>Contact Me Form</h1>
      <h2>
        This demonstrates how to send data from a website form to Google Sheets
        in React or Vanilla JS
      </h2>
      <div>
        <form className="form" onSubmit={Submit}>
          <input placeholder="Your Name" name="Name" type="text" />
          <input placeholder="Your Email" name="Email" type="text" />
          <input placeholder="Your Message" name="Message" type="text" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}
