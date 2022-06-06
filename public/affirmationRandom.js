// affirmations random intention selection 

const btnIntent = document.getElementById('getIntention')

btnIntent.addEventListener('click', intentResults)

function intentResults(){
  let intentions = 
  ['I intend to manifest happiness naturally.', 
  'I intend to respond first and then react.',
  'I intend to lead by example.', 
  'I intend to be open to success and abundance.', 
  'I intend to forgive others, and myself.', 
  'I intend to love unconditionally.', 
  'I intend to make meditation a more important part of my lifestyle.', 
  'I intend to make someone smile every day.', 
  'I intend to show up for myself.',  
  'I intend to pause before responding in conversation and lead with empathy and love.', 
  'I intend to dance like nobody is watching.', 
  'I intend to  allow myself grace.'];
  let intention = intentions[Math.floor(Math.random()*intentions.length)];

  displayIntent.innerText = 'This week...' + intention

}
