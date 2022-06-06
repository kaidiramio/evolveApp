const times = document.querySelectorAll(".fa.fa-times");

Array.from(times).forEach(function(element) {
    element.addEventListener('click', function(){
      // console.log(this.parentNode.parentNode.childNodes[5].innerText)
  
      const moodId = this.parentNode.parentNode.id
  
      fetch('mood-delete', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            '_id': moodId
        })
      }) .then(data => {
        console.log(data)
        window.location.reload(true)
      })
    });
  });