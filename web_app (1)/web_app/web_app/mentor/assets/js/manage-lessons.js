document.addEventListener("click", function(e) {

  // Bấm Create New Lesson
  if (e.target.closest("#createLessonBtn")) {
    const form = document.getElementById("createLessonForm");
    if (form) form.style.display = "block";
  }

  // Bấm Cancel
  if (e.target.closest("#cancelLessonBtn")) {
    const form = document.getElementById("createLessonForm");
    if (form) form.style.display = "none";
  }

  // Bấm Save
  if (e.target.closest("#saveLessonBtn")) {
    const title = document.getElementById("lessonTitle").value;
    const students = document.getElementById("lessonStudents").value;
    const status = document.getElementById("lessonStatus").value;
    const tableBody = document.getElementById("lessonTableBody");

    if (!title) {
      alert("Enter lesson title");
      return;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="check"></span></td>
      <td>${title}</td>
      <td>${students || 0}</td>
      <td>Today</td>
      <td><span class="pill ${status}">${status}</span></td>
      <td>
        <div class="rowActions">
          <button class="editBtn">✎ Edit</button>
          <button class="dangerBtn">🗑</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
    document.getElementById("createLessonForm").style.display = "none";
  }

});
document.addEventListener("click", function(e) {

  // Bấm Create New Lesson
  if (e.target.closest("#createLessonBtn")) {
    const form = document.getElementById("createLessonForm");
    if (form) form.style.display = "block";
  }

  // Bấm Cancel
  if (e.target.closest("#cancelLessonBtn")) {
    const form = document.getElementById("createLessonForm");
    if (form) form.style.display = "none";
  }

  // Bấm Save
  if (e.target.closest("#saveLessonBtn")) {
    const title = document.getElementById("lessonTitle").value;
    const students = document.getElementById("lessonStudents").value;
    const status = document.getElementById("lessonStatus").value;
    const tableBody = document.getElementById("lessonTableBody");

    if (!title) {
      alert("Enter lesson title");
      return;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="check"></span></td>
      <td>${title}</td>
      <td>${students || 0}</td>
      <td>Today</td>
      <td><span class="pill ${status}">${status}</span></td>
      <td>
        <div class="rowActions">
          <button class="editBtn">✎ Edit</button>
          <button class="dangerBtn">🗑</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
    document.getElementById("createLessonForm").style.display = "none";
  }

});
