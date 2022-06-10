//const res = require("express/lib/response");

  /**
   * You might want to use this template to display each new characters
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template#examples
   */
 

  // !!!!!!!!!!!! //
  //qs and qa are not used everywhere. There're just here, because I started implementing them after Paulne presentation.
  //Now I will use them on the next whole next project !

  const qs = (selector, element=document) =>{
    return element.querySelector(selector)
  }

  const qsa = (selector, element=document) =>{
    return element.querySelectorAll(selector)
  }
  
  const characterTemplate = document.getElementById('template')
  const characterContainer = document.querySelector('.characters-container')

  document.getElementById('fetch-all').addEventListener('click', async function (event) {
    const ans = await axios.get('http://localhost:5005/characters/')
    displayAll(ans.data)
  });

  const fetchOneButton = qs('#fetch-one')
  fetchOneButton.addEventListener('click', async function (event) {
    event.preventDefault()
    const nameToSearch = document.querySelector('input[name="character-name"]').value
    const {data} = (await axios.get(`http://localhost:5005/characters/${nameToSearch}`))
    characterContainer.innerHTML=''
    if(data.length===0){
      displayError('NOT FOUND !')
      setAnswerColor(fetchOneButton,false)
      return
    }
    displayOne(data[0],data[0]._id)
    setAnswerColor(fetchOneButton,true)
  });

  document.getElementById('delete-one').addEventListener('click', async function (event) {
    try {
      characterContainer.innerHTML=''
      const idToDelete = document.querySelector('input[name="character-id-delete"]').value
      await axios.delete(`http://localhost:5005/characters/${idToDelete}`)
      setAnswerColor(document.getElementById('delete-one'),true)
    } catch (error) {
      setAnswerColor(document.getElementById('delete-one'),false)
    }
  });

const form=document.getElementById('edit-character-form')
  form.addEventListener('submit', function (event) {
    event.preventDefault()
    const id= form.querySelector('input[name="chr-id"]').value
    const name= form.querySelector('input[name="name"]').value
    const occupation = form.querySelector('input[name="occupation"]').value
    const weapon = form.querySelector('input[name="weapon"]').value
    const cartoon = form.querySelector('input[name="cartoon"]').checked
    editCharacter(id,{name,occupation,weapon},cartoon)
  });

  document.getElementById('new-character-form').addEventListener('submit', function (event) {
    event.preventDefault()
    const name= document.querySelector('input[name="name"]').value
    const occupation = document.querySelector('input[name="occupation"]').value
    const weapon = document.querySelector('input[name="weapon"]').value
    const cartoon = document.querySelector('input[name="cartoon"]').checked
    createNewCharacter({name,occupation,weapon,cartoon})
  });

  const createNewCharacter = async ({name,occupation,weapon,cartoon}) =>{
    try{
      if( name.length>3 && occupation.length>3 && weapon.length>3 ){
        const ans = await axios.post('http://localhost:5005/characters',{
        name,
        occupation,
        weapon,
        cartoon
        })
        if(ans.status===200){
          setAnswerColor(document.querySelector('#send-data'),true)
        }else{
          setAnswerColor(document.querySelector('#send-data'),false)
        }
      }else{
        setAnswerColor(document.querySelector('#send-data'),false)
      }
    }catch(e){
      setAnswerColor(document.querySelector('#send-data'),false)
    }
  }

  const editCharacter = async (id,obj,cartoon) =>{
    const objToSend = {}
    Object.keys(obj).forEach(key=>{if(obj[key].length>3){objToSend[key]=obj[key]}})
    try {
      if(id.length>0){
        const ans = await axios.patch(`http://localhost:5005/characters/${id}`,{
          ...objToSend,
          cartoon
        })
        if(ans.status===200){
          setAnswerColor(document.querySelector('#edit-character-form button'),true)
        }else{
          setAnswerColor(document.querySelector('#edit-character-form button'),false)
        }
      }
    } catch (error) {
      setAnswerColor(document.querySelector('#edit-character-form button'),false)
    }
  }

  const displayAll = (data) =>{
    characterContainer.innerHTML=''
    data.forEach(char => displayOne(char))
  }

  const displayOne = (char) =>{
    console.log('displayOne : ')
    const clone = characterTemplate.content.cloneNode(true)
    
    qs('.character-id',clone).innerHTML+=`<span>${char._id}</span>`
    qs('.name',clone).innerHTML+=`<span>${char.name}</span>`
    qs('.occupation',clone).innerHTML+=`<span>${char.occupation}</span>`
    qs('.cartoon',clone).innerHTML+=`<span>${char.cartoon ? 'true' : 'false'}</span>`
    qs('.weapon',clone).innerHTML+=`<span>${char.weapon}</span>`
    characterContainer.append(clone)
  }

  //set the color of the buttons 
  const setAnswerColor = (buttonEl, color) =>{
    console.log('answer')
    buttonEl.classList.add(color ? 'good' : 'error')
    setTimeout(()=>{
      buttonEl.classList.remove(color ? 'good' : 'error')
    },1000)
  }

  const displayError = (message) =>{
    const container = document.querySelector('.container')
    container.classList.add('error')
    characterContainer.innerHTML=`<div><p>${message} !</p></div>`
    setTimeout(()=>{
      container.classList.remove('error')
    },1000)
  }

  const displayErased = () =>{
    characterContainer.innerHTML="<div><p>ERASED !</p></div>"
  }

  

  //...............................;/:
  //review



  // const baseUrl = 'http://localhost:5005/api/characters'
  // const axiosInstance = axios.create({
  //   baseUrl:"http:/localhost:5055/api/characters"
  // })
  // const ans = await axiosInstance.get('/1203943abdf')

  // const APIHandler = { ...axiosInstance }
  // APIHandler.getFullList = async function () {
  //   try{
  //     const {data}= await this.get(`${baseUrl}`)
  //     return data
  //   }catch(e){
  //     console.log(e)
  //   }
  // }