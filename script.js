const courses = {
  "Calculo Diferencial": { prerequisites: [], unlocks: ["Calculo integral", "Física"] },
  "Botánica general Y taxonómica": { prerequisites: [], unlocks: [] },
  "Química general": { prerequisites: [], unlocks: ["Química inorgánica", "Química orgánica I", "Fisicoquímica"] },
  "Biología general": { prerequisites: [], unlocks: ["Biología molecular"] },
  "Historia de la farmacia": { prerequisites: [], unlocks: ["Legislación Farmacéutica"] },
  "Comunicación": { prerequisites: [], unlocks: ["Metodología de la investigación"] },

  "Calculo integral": { prerequisites: ["Calculo Diferencial"], unlocks: ["Fisicoquímica", "Bioestadística"] },
  "Física": { prerequisites: ["Calculo Diferencial"], unlocks: [] },
  "Química inorgánica": { prerequisites: ["Química general"], unlocks: ["Química analítica"] },
  "Química orgánica I": { prerequisites: ["Química general"], unlocks: ["Química orgánica II", "Bioquímica"] },
  "Biología molecular": { prerequisites: ["Biología general"], unlocks: ["Microbiología y parasitología"] },
  "Desarrollo humano": { prerequisites: [], unlocks: ["Ética farmacéutica y bioética"] },

  "Fisicoquímica": { prerequisites: ["Calculo integral", "Química general"], unlocks: ["Operaciones unitarias"] },
  "Química analítica": { prerequisites: ["Química inorgánica"], unlocks: ["Análisis instrumental"] },
  "Química orgánica II": { prerequisites: ["Química orgánica I"], unlocks: ["Química farmacéutica"] },
  "Bioquímica": { prerequisites: ["Química orgánica I"], unlocks: ["Inmunología", "Morfofisiología"] },
  "Microbiología y parasitología": { prerequisites: ["Biología molecular"], unlocks: [] },
  "Ética farmacéutica y bioética": { prerequisites: ["Desarrollo humano"], unlocks: [] },

  // Puedes continuar con el resto siguiendo el mismo patrón
};

const grid = document.getElementById("grid");
const courseElements = {};

Object.keys(courses).forEach(course => {
  const div = document.createElement("div");
  div.className = "cell disabled";
  div.innerText = course;
  div.dataset.course = course;
  div.addEventListener("click", () => toggleCourse(course));
  grid.appendChild(div);
  courseElements[course] = div;

  if (courses[course].prerequisites.length === 0) {
    div.classList.remove("disabled");
  }
});

function toggleCourse(course) {
  const el = courseElements[course];
  if (el.classList.contains("disabled")) return;
  el.classList.toggle("active");

  if (el.classList.contains("active")) {
    courses[course].unlocks.forEach(unlockedCourse => {
      const allApproved = courses[unlockedCourse].prerequisites.every(pr => courseElements[pr].classList.contains("active"));
      if (allApproved) {
        courseElements[unlockedCourse].classList.remove("disabled");
      }
    });
  } else {
    // Si desmarcamos un curso, bloqueamos todo lo que dependa de él
    const stack = [course];
    while (stack.length > 0) {
      const current = stack.pop();
      courses[current].unlocks.forEach(child => {
        if (!courseElements[child].classList.contains("disabled")) {
          courseElements[child].classList.add("disabled");
          courseElements[child].classList.remove("active");
          stack.push(child);
        }
      });
    }
  }
}
