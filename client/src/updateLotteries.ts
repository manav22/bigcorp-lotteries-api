import { appState } from "./appState";
import { Lottery } from "../../types";

function createRow(name: String, value: String): HTMLDivElement {
  const div = document.createElement("div");
  div.textContent = `${name}: ${value}`;
  return div;
}

function getLotteryHtml(lottery: Lottery): HTMLDivElement {
  const lotteryContainer = document.createElement("div");
  lotteryContainer.id = `container-${lottery.id}`;
  lotteryContainer.className = "lottery";

  const rows = Object.entries(lottery)
    .sort()
    .map(([key, val]) => createRow(key, val));

  lotteryContainer.append(...rows);

  if (lottery.status === "running") {
    const checkbox = document.createElement("input");
    checkbox.id = lottery.id;
    checkbox.type = "checkbox";
    lotteryContainer.appendChild(checkbox);
  }

  return lotteryContainer;
}

function addNewLottery(lottery: Lottery): void {
  appState.lotteries.set(lottery.id, lottery);

  const lotteriesContainer: HTMLElement | null = document.getElementById("lotteries");
  const lotteryHtml = getLotteryHtml(lottery);
  
  if(lotteriesContainer) {
    lotteriesContainer.appendChild(lotteryHtml);
  }
}

function updateExistingLottery(lottery: Lottery): void {
  const current = appState.lotteries.get(lottery.id) as Lottery;

  const currentData = JSON.stringify(Object.entries(current).sort());
  const newData = JSON.stringify(Object.entries(lottery).sort());

  // Rudimental lottery object data equality check
  if (currentData !== newData) {
    appState.lotteries.set(lottery.id, lottery);

    const lotteryContainer: HTMLElement | null = document.getElementById(`container-${lottery.id}`);

    if (!lotteryContainer) {
      return
    }

    lotteryContainer.innerHTML = "";
    const lotteryHtml = getLotteryHtml(lottery);
    lotteryContainer.appendChild(lotteryHtml);
  }
}

function updateLottery(lottery: Lottery): void {
  if (!appState.lotteries.has(lottery.id)) {
    addNewLottery(lottery);
  } else {
    updateExistingLottery(lottery);
  }
}

export async function updateLotteries(): Promise<void> {
  // TODO: Obtain the lottery data from the GET /lotteries endpoint.
  // 1. Use the `fetch` API to make the request.
  // 2. Update each lottery using the `updateLottery` function above.
  try {
    const responseData = await fetch(`${import.meta.env.VITE_API_URL}/lotteries`);
    const lotteries = await responseData.json();

    for (const lottery of lotteries) {
      updateLottery(lottery)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating lotteries:", error.message);
    }
  }
}