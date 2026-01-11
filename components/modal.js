
function openModal() {
  overlay.classList.remove("hidden")
  overlay.classList.add("flex")
}
const overlay = document.getElementById("modal-overlay")

function openModal() {
  overlay.classList.remove("hidden")
  overlay.classList.add("flex")
}

function closeModal() {
  overlay.classList.add("hidden")
  overlay.classList.remove("flex")
}


// Click overlay to close
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal()
})

// ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal()
})


function closeModal() {
  overlay.classList.add("hidden")
  overlay.classList.remove("flex")
}


// Click overlay to close
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal()
})

// ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal()
})

