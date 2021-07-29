const dropZone = document.querySelector('.drop-zone');
const browseBtn = document.querySelector('.browse-btn');
const fileInput = document.querySelector('#file-input');
const bgProgress = document.querySelector('.bg-progress');
const copyBtn = document.querySelector('#copy-btn');
const percentSpan = document.querySelector('#percent');
const progressContainer = document.querySelector('.progress-container');
const sharingContainer = document.querySelector('.sharing-container');
const emailForm = document.querySelector('#email-form');
const toast = document.querySelector('.toast');

const fileURLInput = document.querySelector('#fileURL');
const host = 'http://127.0.0.1:5000'
const uploadURL = `${host}/api/files`; //from backend
const emailURL = `${host}/api/files/send`; //from backend

const maxAllowedSize = 20 * 1024 * 1024;  //100MB

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
});           //source----------mdn drag events

dropZone.addEventListener('dragleave', ()=>{
    dropZone.classList.remove('dragged');
})

dropZone.addEventListener('drop', (e)=>{
    e.preventDefault();
    dropZone.classList.remove('dragged');
    const files = e.dataTransfer.files;
    console.log('files', files)
    if(files.length){
        fileInput.files = files 
    }
    uploadFile();
})

fileInput.addEventListener("change", (e)=>{
    uploadFile();
})

browseBtn.addEventListener('click', (e) =>{
    fileInput.click();
})

copyBtn.addEventListener('click', ()=>{
    fileURLInput.select();
    document.execCommand('copy');
    showToast("Link Copied")
})

const uploadFile = () => {
    const file = fileInput.files[0];
    if(fileInput.files.length > 1){
        showToast("Upload only one file at a time");
        return 
    }
    if(file.size > maxAllowedSize){
        showToast("Can't upload more than 20MB");
        return
    }
    progressContainer.style.display ='block'
    const formData = new FormData();
    formData.append('myfile',file); 
    const xhr = new XMLHttpRequest();
    //
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){

            console.log(xhr.response)
            onUploadSuccess(JSON.parse(xhr.response));
        }
    }
    
    xhr.upload.onprogress = updateProgress;
    
    xhr.upload.onerror=()=>{
        showToast(`Error in uploading: ${xhr.statusText}`)
        progressContainer.style.display = null

    }

    xhr.open("POST", uploadURL);
    xhr.send(formData)
}

const updateProgress = (e) => {
    const percent = Math.round( ( e.loaded / e.total ) * 100 );
    // console.log(percent)
    percentSpan.innerText = `${percent}%`;
    bgProgress.style.width = `${percent}%`;
}

const onUploadSuccess =( {file: url} ) =>{
    console.log('file', url);
    progressContainer.style.display ='none';
    sharingContainer.style.display ='block';
    bgProgress.style.width = '0%';
    fileURLInput.value = url;
}


const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = " translate(-50%,0)";
    let toastTimer;
    clearTimeout(toastTimer);
    toastTimer  = setTimeout(() =>{
        toast.style.transform = " translate(-50%,100px)";
    }, 3000)
}
