// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login_form")
const loginInput = login.querySelector(".login_input")

//chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat_form")
const chatInput = chat.querySelector(".chat_input")
const chatMessages = chat.querySelector(".chat_messages")

const user = { id: "", name: "", color: ""}

const colors = [
    "cadetblue",
    "hotpink",
    "cornflowerblue",
    "gold",
    "darkkhaki",
    "violet",
    "aqua",
    "chartreuse"
]

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message_self")
    div.innerHTML = content

    return div
}


const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message_other")

    div.classList.add("message_self")
    span.classList.add("message_sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({data}) => {
    const { userId, userName, userColor, content} = JSON.parse(data)

    const message = userId == user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor)

    const element = createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    if (userId != user.id){
        showNotificatioin(userName, content)
    }

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://chat-backend-xhs3.onrender.com")
    websocket.onmessage = processMessage

    requestNotificationPermission()
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

const requestNotificationPermission = () => {
    if (Notification.permission !== "granted"){
        Notification.requestPermission().then(permission => {
            if (permission !== "granted"){
                console.log("Permission denied for notifications.")
            }
        })
    }
}

const showNotificatioin = (title, message) => {
    if (Notification.permission === "granted"){
        new Notification(title, {
            body: message
        })
    }
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)