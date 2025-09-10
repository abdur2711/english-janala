const createElements = (arr) => {
  const htmlElements = arr.map(el => `<span class="btn">${el}</span>`);
  return htmlElements.join(' ');
}

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById('spinner').classList.remove('hidden');
    document.getElementById('word-container').classList.add('hidden');
  }
  else {
    document.getElementById('word-container').classList.remove('hidden');
    document.getElementById('spinner').classList.add('hidden');
  }
}

const loadLessons = () => {
  fetch('https://openapi.programming-hero.com/api/levels/all') // promise of response
  .then(res => res.json()) // promise of json data
  .then(json => displayLessons(json.data))
}

const removeActive = () => {
  const lessonButtons = document.querySelectorAll('.lesson-btn');
  lessonButtons.forEach(btn => btn.classList.remove('active'))
}

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
  .then(res => res.json())
  .then(data => {
    removeActive();
    const clickBtn = document.getElementById(`lesson-btn-${id}`);
    clickBtn.classList.add('active');
    displayLevelWord(data.data)
  })
}

const loadWordDetail = async(id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data)
}

const displayWordDetails = (wordDetail) => {
  console.log(wordDetail)
  const detailsBox = document.getElementById('details-container');
  detailsBox.innerHTML = `
    <div>
      <h2 class="text-2xl font-bold ">${wordDetail.word} (<i class="fa-solid fa-microphone-lines"></i> : ${wordDetail.pronunciation})</h2>
    </div>

    <div>
      <h2 class="font-bold ">Meaning</h2>
      <p>${wordDetail.meaning}</p>
    </div>

    <div>
      <h2 class="font-bold">Example</h2>
      <p>${wordDetail.sentence}</p>
    </div>

    <div>
      <h2 class="font-bold">Synonyms</h2>
      <div>${createElements(wordDetail.synonyms)}</div>
    </div>
  `
  document.getElementById('word_modal').showModal();
}

const displayLevelWord = (words) => {
  // 1. get the container and make it empty
  const wordContainer = document.getElementById('word-container');
  wordContainer.innerHTML = '';

  if(words.length === 0) {
    wordContainer.innerHTML = `
    <div class="col-span-full text-center space-y-6 py-10">
      <img class="mx-auto" src="./assets/alert-error.png" alt="">
      <p class="text-xl font-medium font-bangla text-gray-400">এই লেসন এ এখনো কোনো শব্দ যুক্ত করা হয়নি।</p>
      <h3 class="text-4xl font-bold font-bangla">পরের লেসন এ যান।</h3>
    </div>
    `;
    manageSpinner(false)
    return;
  }

  // 2. get into every words
  words.forEach(word => {
    // 3. create element and append into container
    const card = document.createElement('div');
    card.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
        <h3 class="text-2xl font-bold">${word.word ? word.word : 'শব্দ পাওয়া যায়নি'}</h3>
        <p class="font-medium font-bangla">meaning / pronunciation</p>
        <p class="text-xl font-bangla font-semibold">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}</p>
        <div class="flex justify-between items-center">
          <button class="btn bg-blue-50 hover:bg-blue-200" onclick="loadWordDetail(${word.id})"><i class="fa-solid fa-circle-info"></i></button>
          <button class="btn bg-blue-50 hover:bg-blue-200"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
    `
    wordContainer.appendChild(card)
  });
  manageSpinner(false);
}

const displayLessons = (lessons) => {
  // 1. get the container and make it empty
  const levelContainer = document.getElementById('level-container');
  levelContainer.innerHTML = '';

  // 2. get into every lessons
  lessons.forEach(lesson => {
    // 3. create element and append into container
    const btnDiv = document.createElement('div')
    btnDiv.innerHTML = `
      <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
    `
    levelContainer.append(btnDiv)
  })
}

loadLessons()

