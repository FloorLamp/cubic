import { cubic } from "../../declarations/cubic";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  // Interact with cubic actor, calling the greet method
  const greeting = await cubic.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
