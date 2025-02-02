// const MOCK_NOTES = [
//     {
//         id: 1,
//         title: 'Работа с формами',
//         content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
//         color: colors.GREEN,
//         isFavorite: false,
//     },
//     {
//         id: 2,
//         title: 'Работа с формами',
//         content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
//         color: colors.YELLOW,
//         isFavorite: false,
//     },
//     {
//         id: 3,
//         title: 'Работа с формами',
//         content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
//         color: colors.RED,
//         isFavorite: false,
//     },
//     {
//         id: 4,
//         title: 'Работа с формами',
//         content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
//         color: colors.PURPLE,
//         isFavorite: false,
//     },
//     {
//         id: 5,
//         title: 'Работа с формами',
//         content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
//         color: colors.BLUE,
//         isFavorite: false,
//     },
// ]

// const model = {
//     notes: MOCK_NOTES,
// }
const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    PURPLE: 'purple',
}

const model = {
    notes: [],
    isShowOnlyFavorite: false,
    addNote(title, description, color) {
        const newNote = { title, description, color, id: Math.random(), isFavorite: false }
        this.notes.unshift(newNote)
        // обновляем интерфейс и вызываем 2 метода представления (отображаем новую заметку и показываем количество заметок в счетчике)
        let filterednotes = null
        if (this.isShowOnlyFavorite){
            filterednotes = this.notes.filter(note => note.isFavorite)
        }
        view.renderNotes(filterednotes ? filterednotes : this.notes)
        view.renderNotesCount(this.notes.length)
    },
    deleteNote(id) {
        let filterednotes = null
        this.notes = this.notes.filter(note => note.id !== id)
        if (this.isShowOnlyFavorite){
            filterednotes = this.notes.filter(note => note.isFavorite)
        } else this.notes = this.notes.filter(note => note.id !== id)
        view.renderNotes(filterednotes ? filterednotes : this.notes)
        view.renderNotesCount(this.notes.length)
    },
    toggleFavorite(id) {
        this.notes = this.notes.map((note) => {
            if (note.id === id) {
                note.isFavorite = !note.isFavorite
            }
            return note
        })
        if (this.isShowOnlyFavorite){
            this.notes = this.notes.filter(note => note.isFavorite)
        }
        view.renderNotes(this.notes)
        view.renderNotesCount(this.notes.length)
    },
    toggleShowOnlyFavorite() {
        this.isShowOnlyFavorite = !this.isShowOnlyFavorite
        let notesToRender
        if (this.isShowOnlyFavorite) {
            notesToRender = this.notes.filter(note => note.isFavorite)
        }
        else {
            notesToRender = this.notes
        }     
        
        view.renderNotes(notesToRender)
        view.renderNotesCount(notesToRender.length)
    }
}


const view = {
    init() {
        this.renderNotes(model.notes)

        const form = document.querySelector('.form-group')
        const inputName = document.querySelector('.input-name')
        const inputDescription = document.querySelector('.input-description')
        const colorsList = document.querySelector('.radio-list')
        const listItems = colorsList.querySelectorAll('li')
        const checkboxFavorites = document.querySelector('.filter-checkbox')
        const notesList = document.querySelector('.notes-list')

        form.addEventListener('submit', function (event) {
            event.preventDefault()
            const title = inputName.value
            const description = inputDescription.value
            let color = ''
            
            listItems.forEach(listItem => {
                const radio = listItem.querySelector(".radio")
                if (radio.checked) {
                    color = radio.value
                }
            }); 
            controller.addNote(title, description, color)

            inputName.value = ''
            inputDescription.value = ''
        })

        checkboxFavorites.addEventListener('click', function (event) {
            controller.toggleFilter()
        })

        notesList.addEventListener('click', function (event) {
            if (event.target.classList.contains('note-image-delete')) {
                const noteId = parseFloat(event.target.parentElement.parentElement.parentElement.id)
                controller.deleteNote(noteId)
            }
            if (event.target.classList.contains('note-image-favorite')) {
                const noteId = parseFloat(event.target.parentElement.parentElement.parentElement.id)
                controller.toggleFavorite(noteId)
            }
        })
    },
    renderNotes(notes) {
        const notesList = document.querySelector('.notes-list')
        const textInfo = document.querySelector('.text-info')
        if (notes.length > 0) {
            textInfo.style.display = "none"
        }
        else {
            textInfo.style.display = "flex"
        }
        let notesHTML = ''
        for (const note of notes) {
            notesHTML += 
            `
            <li id="${note.id}" class="note">
                <div class="note-top note-top-${note.color}">
                    <p class="note-name">${note.title}</p>
                    <div class="note-image-wrapper">
                        <img class="note-image-favorite" src="${note.isFavorite ? 'assets/images/heart-active.png' : 'assets/images/heart-inactive.png'}" alt="toggle-favorite">
                        <img class="note-image-delete" src="assets/images/trash.png" alt="delete-note">
                    </div>
                </div>
                <p class="note-description">${note.description}</p>
            </li>
            `
        }
        notesList.innerHTML = notesHTML
    },
    displayMessage(messageClass) {
        const messageElement = document.querySelector(messageClass)
        messageElement.style.display = 'flex'
        timeoutId = setTimeout(function () {
            messageElement.style.display = 'none'
        }, 3000)
    },
    renderNotesCount(count) {
        const countSpan = document.querySelector('.count')
        countSpan.textContent = count
    },
    renderFilterCheckbox(isChecked) {
        const img = isChecked ? "/assets/images/checkbox-active.png" : "/assets/images/checkbox-inactive.png"
        const checkBox = document.querySelector('.filter-checkbox')
        checkBox.src = img
    }
}


const controller = {
    addNote(title, description, color) {
        if (title.trim() === '' || description.trim() === '') {
            view.displayMessage('.fill-message')
            return
        }
        if (title.trim().length > 50 || description.trim().length > 50) {
            view.displayMessage('.maxLength-message')
            return
        }
        model.addNote(title, description, color)
        view.displayMessage('.info-message')
    }, 
    deleteNote(id) {
        model.deleteNote(id)
        view.displayMessage('.delete-message')
    },
    toggleFavorite(id) {
        model.toggleFavorite(id)
    },
    toggleFilter() {
        model.toggleShowOnlyFavorite()
        view.renderFilterCheckbox(model.isShowOnlyFavorite)
    }
}
function init() {
    view.init()
}

document.addEventListener('DOMContentLoaded', init)