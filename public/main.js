const trash = document.querySelectorAll(".fa-trash");
const pencil = document.querySelectorAll(".fa-pencil-square-o");
// const update = document.querySelectorAll(".updateDoc");


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    // console.log(this.parentNode.parentNode.childNodes[5].innerText)

    const intentionId = this.parentNode.parentNode.id

    fetch('intention-delete', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          '_id': intentionId
      })
    }) .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});


Array.from(pencil).forEach(function(element) {
  element.addEventListener('click', function(){

    const editForm = this.parentNode.parentNode.childNodes[14]

    editForm.classList.toggle('popUp')
  });
});