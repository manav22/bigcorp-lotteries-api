import { updateLotteries } from "./updateLotteries";
import { api_url } from "./constants";

export async function onRegisterClick() {
  const nameInput = document.getElementById("name");
  const checkboxes = Array.from(
    document.querySelectorAll("input[type=checkbox]")
  );
  // updateLotteries();
  // TODO: Register the user for each selected lottery using the POST /register endpoint.
  // 1. Use the `fetch` API to make the request.
  // 2. Obtain the user's name from the `nameInput` element.
  // 3. Check status of the lottery checkboxes using the `checked` property.

  for (const checkbox of checkboxes) {

    if (!checkbox.checked || !checkbox.id || !nameInput.value) {
      console.log("Lottery skipped: checkbox-checked: ", checkbox.checked,
        "checkbox-id: ", checkbox.id,
        "nameInput-value: ", nameInput.value
      );
      continue;
    }

    const data = {
      id: checkbox.id,
      name: nameInput.value
    };

    const body = JSON.stringify(data)
    console.log(body);

    const responseData = await fetch(api_url + '/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,

    });
    console.log(await responseData.json());
  }


  // const responseData = await fetch(api_url + '/register', {
  //   body: JSON.stringify(data),
  // });

  // const name = nameInput.value;
  // console.log(name);

}