const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");
const bgProgress = document.querySelector('.bg-progress');
const percentDiv = document.querySelector('#percent');
const progressContainer = document.querySelector('.progress-container');
const fileURLInput = document.querySelector('#fileURL');
const sharingContainer = document.querySelector('.sharing-container');
const copyBtn = document.querySelector('#copyBtn');


const toast = document.querySelector(".toast")


const host = "https://url-it-app.herokuapp.com/";
const uploadURL = `${host}api/files`
const emailURL = `${host}api/files/send`

const maxAllowedSize = 100 * 1024 * 1024;

dropZone.addEventListener('dragover', (e) => {

    e.preventDefault();
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged")
    }
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove("dragged")
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.log(files);
    if (files.length) {
        fileInput.files = files;
        uploadFile()
    }

});
fileInput.addEventListener("change", () => {
    uploadFile()
})

browseBtn.addEventListener('click', () => {
    fileInput.click();
});

copyBtn.addEventListener('click', () => {
    fileURLInput.select()
    document.execCommand("copy")
    showToast("Link Copied")
})


const uploadFile = () => {

    if (fileInput.files.length > 1) {
        resetFileInput()
        showToast("Only upload 1 file!")
        return;
    }
    const file = fileInput.files[0];


    if (file.size > maxAllowedSize) {
        showToast("Can't Upload more than 100MB")
        resetFileInput();
        return;
    }

    progressContainer.style.display = "block";


    const formData = new FormData();
    formData.append("myfile", file);


    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {

        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response))

        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = () => {
        resetFileInput()
        showToast(`Error in upload:${xhr.statusText}`)
    }

    xhr.open("POST", uploadURL);
    xhr.send(formData);





};
const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    bgProgress.style.width = `${percent}%`
    percentDiv.innerText = percent;

}

const showLink = ({ file: url }) => {
    console.log(url)
    resetFileInput()
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block"
    fileURLInput.value = url;

}


const resetFileInput = () => {
    fileInput.value = "";

}



let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%,0)";
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50%,60px)";
    }, 2000);
}