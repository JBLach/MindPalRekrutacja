document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.querySelector('#noteForm');
  const noteFormWrapper = document.querySelector('.notebook__form');
  const noteFormButton = document.querySelector('.notebook__form--btn');
  const noteTitleField = document.querySelector('.notebook__form--field');
  const noteBodyField = document.querySelector('.notebook__form--textarea');
  const searchField = document.querySelector('.notebook__searchbar--field');
  const addNoteTrigger = document.querySelector('.notebook__empty--btn');
  const addNoteHeaderTrigger = document.querySelector(
    '.notebook__header--addnew'
  );
  const noNotesMessage = document.querySelector('.notebook__empty');
  const cancelBtn = document.querySelector('.cancel-btn');
  const deletePopup = document.querySelector('.notebook-delete-popup');
  const overlay = document.querySelector('.overlay');
  const deleteConfirmBtn = deletePopup.querySelector('.delete-btn');
  const deleteCancelBtn = deletePopup.querySelector('.cancel-delete-btn');

  let notes = [];
  let noteIdToDelete = null;

  const renderNotes = (filter = '') => {
    notesContainer.innerHTML = '';
    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(filter.toLowerCase()) ||
        note.body.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredNotes.length === 0) {
      noNotesMessage.classList.remove('hidden');
      addNoteHeaderTrigger.classList.add('hidden');
    } else {
      addNoteHeaderTrigger.classList.remove('hidden');
      noNotesMessage.classList.add('hidden');
      filteredNotes.forEach((note) => {
        const noteItem = document.createElement('div');
        noteItem.classList.add('notebook-item');
        noteItem.innerHTML = `
          <ul class="notebook-item__icons">
            <li>
              <img
                src="./assets/img/editNote-icon.svg" 
                alt="Edit note"
                width="20"
                height="20"
                data-id="${note.id}"
                class="edit-note pointer"
              >
            </li>
            <li>
              <img
                src="./assets/img/deleteNote-icon.svg" 
                alt="Delete note"
                width="20"
                height="20"
                data-id="${note.id}"
                class="delete-note pointer"
              >
            </li>
          </ul>
          <p class="notebook-item__title">${note.title}</p>
          <p class="notebook-item__body">${note.body}</p>
          <span class="notebook-item__date">${note.date}</span>
        `;
        notesContainer.appendChild(noteItem);
      });
    }
  };

  const addNote = (title, body) => {
    const options = { month: 'short', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-US', options);
    const note = { id: Date.now(), title, body, date };
    notes.push(note);
    renderNotes();
  };

  const editNote = (id, title, body) => {
    notes = notes.map((note) =>
      note.id === id ? { ...note, title, body } : note
    );
    renderNotes();
  };

  const confirmDeleteNote = () => {
    if (noteIdToDelete !== null) {
      notes = notes.filter((note) => note.id !== noteIdToDelete);
      renderNotes();
      closeDeletePopup();
    }
  };

  const openDeletePopup = (id) => {
    noteIdToDelete = id;
    deletePopup.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeDeletePopup = () => {
    noteIdToDelete = null;
    deletePopup.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = noteTitleField.value;
    const body = noteBodyField.value;
    const noteId = noteForm.getAttribute('data-edit-id');

    if (noteId) {
      editNote(Number(noteId), title, body);
      noteForm.removeAttribute('data-edit-id');
    } else {
      addNote(title, body);
    }

    noteFormButton.textContent = 'Add';

    noteForm.reset();
  });

  notesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-note')) {
      const noteId = Number(e.target.getAttribute('data-id'));
      const note = notes.find((note) => note.id === noteId);
      noteTitleField.value = note.title;
      noteBodyField.value = note.body;
      noteForm.setAttribute('data-edit-id', noteId);
      noteFormWrapper.classList.remove('hidden');
      noteFormButton.textContent = 'Edit';

      noteFormWrapper.scrollIntoView({ behavior: 'smooth' });
      // console.log('edit')
    }

    if (e.target.classList.contains('delete-note')) {
      const noteId = Number(e.target.getAttribute('data-id'));
      openDeletePopup(noteId);
    }
  });

  searchField.addEventListener('input', (e) => {
    renderNotes(e.target.value);
  });

  addNoteTrigger.addEventListener('click', () => {
    noteForm.reset();
    noteFormWrapper.classList.remove('hidden');
  });

  addNoteHeaderTrigger.addEventListener('click', () => {
    noteForm.reset();
    noteFormWrapper.classList.remove('hidden');
  });

  cancelBtn.addEventListener('click', () => {
    noteForm.reset();
    noteForm.removeAttribute('data-edit-id');
    noteFormButton.textContent = 'Add';
    noteFormWrapper.classList.add('hidden');
  });

  deleteConfirmBtn.addEventListener('click', confirmDeleteNote);
  deleteCancelBtn.addEventListener('click', closeDeletePopup);
  overlay.addEventListener('click', closeDeletePopup);

  renderNotes();
});
