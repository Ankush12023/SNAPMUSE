const arrayContainer = document.getElementById("arrayContainer");
const generateArrayBtn = document.getElementById("generateArray");
const sortArrayBtn = document.getElementById("sortArray");
const speedControl = document.getElementById("speed");
const colorPicker = document.getElementById("barColor");
const sortAlgo = document.getElementById("sortAlgo");

let array = [];
let bars = [];
let speed = 50;
let isSorting = false;

// Generate a random array
function generateRandomArray() {
    array = [];
    for (let i = 0; i < 50; i++) {
        array.push(Math.floor(Math.random() * 200) + 10);
    }
    displayArray();
}

// Display the array as bars
function displayArray() {
    arrayContainer.innerHTML = '';
    bars = [];
    array.forEach((value, idx) => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}px`;
        bar.style.backgroundColor = colorPicker.value;
        bars.push(bar);
        arrayContainer.appendChild(bar);
    });
}

// Bubble sort implementation
async function bubbleSort() {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                updateBars(j, j + 1);
                await sleep(speed);
            }
        }
    }
}

// Quick sort implementation
async function quickSort(start, end) {
    if (start < end) {
        let pivotIndex = await partition(start, end);
        await quickSort(start, pivotIndex - 1);
        await quickSort(pivotIndex + 1, end);
    }
}

// Partition for quick sort
async function partition(start, end) {
    let pivotValue = array[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
        if (array[i] < pivotValue) {
            [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
            updateBars(i, pivotIndex);
            pivotIndex++;
            await sleep(speed);
        }
    }
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    updateBars(pivotIndex, end);
    await sleep(speed);
    return pivotIndex;
}

// Selection sort implementation
async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            updateBars(i, minIndex);
            await sleep(speed);
        }
    }
}

// Update the heights of two bars
function updateBars(idx1, idx2) {
    let tempHeight = bars[idx1].style.height;
    bars[idx1].style.height = bars[idx2].style.height;
    bars[idx2].style.height = tempHeight;
}

// Speed control
speedControl.addEventListener("input", (e) => {
    speed = 101 - e.target.value;
});

// Sleep function for async sorting
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start sorting process
sortArrayBtn.addEventListener("click", async () => {
    if (isSorting) return;
    isSorting = true;

    // Reset the array and re-display it for every sort to avoid needing to refresh the page
    displayArray();

    if (sortAlgo.value === "bubble") {
        await bubbleSort();
    } else if (sortAlgo.value === "quick") {
        await quickSort(0, array.length - 1);
    } else if (sortAlgo.value === "selection") {
        await selectionSort();
    }

    isSorting = false;
});

// Generate random array button
generateArrayBtn.addEventListener("click", generateRandomArray);

// Color picker for bar color
colorPicker.addEventListener("input", () => {
    bars.forEach(bar => bar.style.backgroundColor = colorPicker.value);
});

// Initial array generation
generateRandomArray();
