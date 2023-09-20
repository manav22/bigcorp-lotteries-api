
export async function onRegisterClick(): Promise<void> {
  const nameInput = document.getElementById("name") as HTMLInputElement;
  const checkboxes = Array.from(
    document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>
  );


  if (!nameInput) {
    return;
  }

  let checkbox: HTMLInputElement;

  for (checkbox of checkboxes) {

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

    const responseData = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,

    });
    console.log(await responseData.json());
  }
}