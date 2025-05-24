const autocomplete = document.querySelector(".autocomplete");
const result = document.querySelector(".result");
const search = document.getElementById("search");

autocomplete.addEventListener("click", (e) => {
  if (e.target.className === "autocomplete-item") {
    const repoId = e.target.dataset.repoId;
    const name = e.target.dataset.name;
    const owner = e.target.dataset.owner;
    const stars = e.target.dataset.stars;
    if (![...result.children].some((el) => el.dataset.repoId === repoId)) {
      const li = document.createElement("li");
      li.classList.add("result-item");
      li.dataset.repoId = repoId;

      const divInfo = document.createElement("div");
      divInfo.classList.add("result-item-info");

      const spanName = document.createElement("span");
      spanName.classList.add("result-item-name");
      spanName.textContent = `Name: ${name}`;

      const spanOwner = document.createElement("span");
      spanOwner.classList.add("result-item-owner");
      spanOwner.textContent = `Owner: ${owner}`;

      const spanStars = document.createElement("span");
      spanStars.classList.add("result-item-stars");
      spanStars.textContent = `Stars: ${stars}`;

      divInfo.append(spanName, spanOwner, spanStars);
      li.append(divInfo);

      const button = document.createElement("button");
      button.classList.add("remove-button");
      const img = document.createElement("img");
      img.src = "img/cancel.svg";
      button.append(img);
      li.append(button);

      result.append(li);
    }
    autocomplete.innerHTML = "";
    search.value = "";
  }
});

result.addEventListener("click", (e) => {
  if (e.target.closest(".remove-button")) {
    let repo = e.target.closest(".result-item");
    repo.remove();
  }
});

const fn = async function (word) {
  if (!word.trim()) {
    autocomplete.innerHTML = "";
    return;
  }
  const requestURL = `https://api.github.com/search/repositories?q=${word}&per_page=5`;
  let response = await fetch(requestURL);
  let repos = await response.json();

  autocomplete.innerHTML = "";
  if (!repos.items) return;
  for (let repo of repos.items) {
    const li = document.createElement("li");
    li.classList.add("item");

    const button = document.createElement("button");
    button.classList.add("autocomplete-item");
    button.textContent = repo.name;

    button.dataset.repoId = repo.id;
    button.dataset.name = repo.name;
    button.dataset.owner = repo.owner?.login ?? "";
    button.dataset.stars = repo.stargazers_count ?? "";

    li.append(button);
    autocomplete.append(li);
  }
};

const debounce = (fn, debounceTime) => {
  let timer = null;
  return function wrapper(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

const debouncedFn = debounce(fn, 500);

search.addEventListener("keyup", function (e) {
  let word = e.target.value;
  debouncedFn(word);
});
