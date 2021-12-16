/** @format */
const carusel = document.querySelector('.carusel');
const body = document.querySelector('body');
const slidesContainer = document.querySelector('.slides-container');
const section1 = document.querySelector('.section-1');
const section2 = document.querySelector('.section-2');

const sectionTemplate = document.getElementById('special-section-template');
const cardTemplate = document.getElementById('card-template');
const postArticleTemplate = document.getElementById('post-article-template');

/* ---------------------------- HELPER FUNCTIONS --------------------------- */

// ELEMENT CREATOR AND APPEND THIS TO ELEMENT HOST
function elementsCreator(el, clsName, hostElement, content = null) {
	const element = document.createElement(el);
	element.className = clsName;
	hostElement.append(element);
	if (content) {
		element.innerHTML = content;
	}
	return element;
}

// REMOVE ACTIVE CLASS FROM ELEMENTS  ARRAY
function removeClass(array) {
	array.forEach((el) => {
		el.classList.remove('active');
	});
}

function metaScoreColor(meta_score) {
	let class_name = '';
	if (meta_score >= 60) {
		class_name = 'good';
	} else if (meta_score >= 40 && meta_score <= 59) {
		class_name = 'average';
	} else if (meta_score >= 0 && meta_score <= 39) {
		class_name = 'bad';
	} else if (meta_score === 'NA') {
		class_name = 'no-score';
	}
	return class_name;
}

/* -------------------------------- MAIN-MENU ------------------------------- */
const mobileBtn = document.querySelector('.mobile-btn');
const modes = document.querySelectorAll('.mode');
const darkMode = document.getElementById('dark-mode');
const lightMode = document.getElementById('light-mode');
const switcher = document.querySelector('.switch input');

// MOBILE BUTTON EVENTS

function showMobileMenuHandler() {
	const mobileMenu = document.querySelector('.nav-container');
	mobileMenu.classList.toggle('active');
}
mobileBtn.addEventListener('click', showMobileMenuHandler);

// Them DARK MODE SWITCHER
function themSwitchHandler(e) {
	if (e.currentTarget.checked) {
		localStorage.setItem('isDarkMode', true);
		removeClass(modes);
		darkMode.classList.add('active');
		body.classList.add('dark-mode');
		document.querySelector('.brand img').src = './images/icons/logo-light.svg';
	} else {
		localStorage.clear();
		removeClass(modes);
		body.classList.remove('dark-mode');
		lightMode.classList.add('active');
		document.querySelector('.brand img').src = './images/icons/logo-dark.svg';
	}
}

// REMEMBER DARK MODE IF CHECKED BY USER
if (localStorage.getItem('isDarkMode') === 'true') {
	const themModeCheckBox = document.querySelector(
		'.them-switcher input[type=checkbox]',
	);
	themModeCheckBox.checked = true;
	removeClass(modes);
	darkMode.classList.add('active');
	body.classList.add('dark-mode');
	document.querySelector('.brand img').src = './images/icons/logo-light.svg';
}

switcher.addEventListener('change', themSwitchHandler);

/* --------------------------------- SLIDER --------------------------------- */
// FETCH SLIDER DATA FRO API
fetch('./db.json')
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		const result = data.slider;
		return result;
	})
	.then((sliderData) => {
		slider(sliderData);
		const slides = document.querySelectorAll('.slide');
		const nextBtn = document.querySelector('.next-btn');
		const prevBtn = document.querySelector('.prev-btn');
		const bullets = document.querySelectorAll('.bullet');
		const bulletsContainer = document.querySelector('.bullets');
		let slideWidth = slides[0].clientWidth;
		// ORDER EACH SLIDE SIDE BY SIDE
		slides.forEach((slide, i) => {
			slide.style.left = i * slideWidth + 'px';
		});

		// CONTROL SIZE OF SLIDE WHEN WINDOW RESIZE
		window.addEventListener('resize', () => {
			clearInterval('resize');
			slides.forEach((slide, i) => {
				slide.style.left = i * slideWidth + 'px';
			});
		});

		// BASE SLIDER INDEX
		let slideIndex = 0;

		// SHOW CURRENT SLIDE AND CURRENT BULLET
		function showSlide(slideIndex) {
			slidesContainer.style.transform =
				'translateX(-' + slideWidth * slideIndex + 'px)';
			removeClass(bullets);
			bullets[slideIndex].classList.add('active');
		}

		function nextSlideHandler() {
			slideIndex++;
			if (slideIndex >= slides.length) {
				slideIndex = 0;
			}

			showSlide(slideIndex);
		}

		function prevSlideHandler() {
			slideIndex--;
			if (slideIndex < 0) {
				slideIndex = slides.length - 1;
			}
			showSlide(slideIndex);
		}

		bulletsContainer.addEventListener('click', (event) => {
			removeClass(bullets);
			event.target.classList.add('active');
			let bulletIndex = 0;
			for (let index = 0; index < bullets.length; index++) {
				if (bullets[index].classList.contains('active')) {
					bulletIndex = index;
				}
			}
			slideIndex = bulletIndex;
			showSlide(slideIndex);
		});

		prevBtn.addEventListener('click', prevSlideHandler);
		nextBtn.addEventListener('click', nextSlideHandler);

		const interval = setInterval(() => {
			nextSlideHandler();
		}, 10000);
	});

//  SLIDER SECTION CREATOR
function slider(data) {
	data.forEach((el) => {
		const slide = document.createElement('div');

		slide.className = `slide ${el.id === 'slide-1' ? 'active' : ''}`;
		slide.id = el.id;
		slide.style.backgroundImage = `url(${el.image_url})`;
		slide.style.backgroundRepeat = `no-repeat`;
		slide.style.backgroundSize = `cover`;
		slide.style.backgroundPosition = `center`;

		const container = elementsCreator('div', 'container', slide);
		const row = elementsCreator('div', 'row', container);
		const col_2_Left = elementsCreator('div', 'col-2', row);
		const slideTitle = elementsCreator(
			'h1',
			'slide-title',
			col_2_Left,
			el.title,
		);
		const movieDetails = elementsCreator('div', 'movie-details', col_2_Left);
		const rating = elementsCreator(
			'div',
			'rating',
			movieDetails,
			'<embed src="./images/icons/star.svg" type="" /><span class="rating-score">4.5</span>',
		);
		const genresEl = elementsCreator('div', 'genres', movieDetails);
		const genres = el.genres;
		for (let index = 0; index < genres.length; index++) {
			const genreEl = elementsCreator('div', 'genre', genresEl, genres[index]);
		}
		const movieInfos = elementsCreator('div', 'movie-infos', col_2_Left);
		const director = elementsCreator(
			'p',
			'director',
			movieInfos,
			`<span class="filed-name">Director : </span> ${el.director}`,
		);
		const contains = elementsCreator('p', 'contains', movieInfos);
		const cntFiledName = elementsCreator(
			'span',
			'filed-name',
			contains,
			`${el.title} Contains:`,
		);

		el.info.forEach((ele) => {
			const numEle = elementsCreator(
				'span',
				'num-ele',
				contains,
				`${ele.title} (${ele.release_Date})`,
			);
		});

		const description = elementsCreator('p', 'description', movieInfos);
		const decripFiledName = elementsCreator(
			'span',
			'filed-name',
			description,
			'Description',
		);
		const descContent = elementsCreator(
			'span',
			'',
			description,
			el.description,
		);
		const slideAction = elementsCreator('div', 'slide-action', col_2_Left);
		const slideBtn = elementsCreator(
			'button',
			'btn btn-danger',
			slideAction,
			'MORE INFO',
		);
		const col_2_Right = elementsCreator('div', 'col-2 col-right', row);
		const showTrailer = elementsCreator('div', 'show-trailer', col_2_Right);
		const playTrailer = elementsCreator(
			'div',
			'play',
			showTrailer,
			`<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M28 0C12.5608 0 0 12.5608 0 28C0 43.4392 12.5608 56 28 56C43.4392 56 56 43.4392 56 28C56 12.5608 43.4392 0 28 0ZM22.4 37.6992V18.3008L39.2 28L22.4 37.6992Z" fill="white"/>
			</svg>`,
		);
		const text = elementsCreator('h4', '', showTrailer, 'PLAY TRAILER');

		slidesContainer.append(slide);
	});
	const caruselNavigation = elementsCreator(
		'div',
		'carusel-navigation',
		carusel,
	);
	const backBtnEl = elementsCreator(
		'div',
		'prev-btn',
		caruselNavigation,
		`
			<svg
							width="11"
							height="21"
							viewBox="0 0 11 21"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.0876 20.6644C10.2683 20.6643 10.4448 20.6104 10.5946 20.5095C10.7445 20.4086 10.8608 20.2653 10.9288 20.0979C10.9968 19.9306 11.0133 19.7467 10.9763 19.5699C10.9392 19.3931 10.8503 19.2314 10.7208 19.1054L2.28195 10.6665L10.7208 2.22766C10.808 2.14399 10.8775 2.04376 10.9255 1.93286C10.9734 1.82196 10.9987 1.7026 11 1.58179C11.0012 1.46098 10.9783 1.34113 10.9326 1.22928C10.887 1.11742 10.8194 1.0158 10.734 0.930367C10.6486 0.844934 10.5469 0.777408 10.4351 0.731741C10.3232 0.686074 10.2034 0.663185 10.0826 0.664415C9.96177 0.665644 9.84241 0.690967 9.73151 0.738901C9.62061 0.786835 9.52038 0.856415 9.4367 0.943568L0.355808 10.0245C0.185572 10.1948 0.089941 10.4257 0.089941 10.6665C0.0899409 10.9073 0.185572 11.1383 0.355808 11.3086L9.4367 20.3895C9.52133 20.4764 9.62253 20.5456 9.73433 20.5928C9.84613 20.64 9.96626 20.6644 10.0876 20.6644V20.6644Z"
								fill="white"
							/>
						</svg>
			`,
	);
	const nextBtnEL = elementsCreator(
		'div',
		'next-btn',
		caruselNavigation,
		`
			<svg
							width="11"
							height="21"
							viewBox="0 0 11 21"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1.00235 0.664368C0.821698 0.664415 0.645167 0.718336 0.495323 0.819237C0.34548 0.920139 0.229133 1.06344 0.161156 1.23081C0.0931788 1.39818 0.0766613 1.58202 0.113715 1.75883C0.150769 1.93564 0.239709 2.09738 0.369167 2.22337L8.80802 10.6622L0.369167 19.1011C0.282014 19.1847 0.212433 19.285 0.164499 19.3959C0.116566 19.5068 0.0912422 19.6261 0.0900128 19.7469C0.0887835 19.8678 0.111673 19.9876 0.15734 20.0995C0.203007 20.2113 0.270534 20.3129 0.355966 20.3984C0.441399 20.4838 0.543018 20.5513 0.654875 20.597C0.766731 20.6427 0.886575 20.6656 1.00739 20.6643C1.1282 20.6631 1.24755 20.6378 1.35846 20.5898C1.46936 20.5419 1.56959 20.4723 1.65326 20.3852L10.7342 11.3043C10.9044 11.134 11 10.903 11 10.6622C11 10.4214 10.9044 10.1905 10.7342 10.0202L1.65326 0.939278C1.56864 0.852288 1.46744 0.783141 1.35564 0.735924C1.24384 0.688706 1.12371 0.664375 1.00235 0.664368V0.664368Z"
								fill="white"
							/>
						</svg>
			`,
	);

	const bulletsContainer = elementsCreator('div', 'bullets', carusel);
	data.forEach((slide) => {
		const clsName = slide.id === 'slide-1' ? 'bullet active' : 'bullet';
		const bullet = elementsCreator('div', clsName, bulletsContainer);
	});
}

/* ---------------------------- FETCH MOVIES DATA --------------------------- */
const genresFilterSlectionEl = document.getElementById('genres-filter');
const postsContainer = document.querySelector('.posts-container');

fetch('./db.json')
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		return data.movies;
	})
	.then((result) => {
		const movies = result;
		const lastMovies = movies.filter((movie) => movie.release_Date === 2021);
		const topRatedMovies = movies.filter((movie) => movie.users_rating >= 90);
		specialSectionCreator('last movies', 'last-movies', lastMovies, section1);
		specialSectionCreator(
			'top rated movies',
			'top-rated-movies',
			topRatedMovies,
			section1,
		);

		let moviesData = movies;
		// get Genres DAta From API
		const genresArray = movies.map((movie) => movie.genres).flat();
		const genres = new Set(genresArray);
		SelectFill(genres);

		loadMoviePosts(moviesData);

		function postsFilter() {
			filter =
				genresFilterSlectionEl.options[genresFilterSlectionEl.selectedIndex]
					.value;

			const posts = postsContainer.querySelectorAll('.post');

			posts.forEach((post) => {
				const postGenres = post.querySelectorAll('.post-genres');

				postGenres.forEach((postGenre) => {
					postGenre.textContent
						.toLocaleLowerCase()
						.indexOf(filter.toLocaleLowerCase()) > -1
						? (post.style.display = '')
						: (post.style.display = 'none');

					if (filter === 'all genres') {
						post.style.display = '';
					}
				});
			});
		}
		genresFilterSlectionEl.addEventListener('change', postsFilter);
	});

// SPECIAL SECTION CREATOR
function specialSectionCreator(
	sectionTitle,
	sectionId,
	sectionData,
	sectionHost,
) {
	const section = document.importNode(sectionTemplate.content, true);
	section.querySelector('.special').id = sectionId;
	section.querySelector('.section-header .header-title').textContent =
		sectionTitle;
	const cardsWrapper = section.querySelector('.cards-wrapper');
	sectionData.forEach((movie) => {
		const card = document.importNode(cardTemplate.content, true);
		card.querySelector('.image-box img').src = movie.image_url;
		card.querySelector('.rating').textContent = movie.users_rating;
		const genres = card.querySelector('.genres');
		for (let index = 0; index < movie.genres.length; index++) {
			const genre = elementsCreator(
				'div',
				'genre',
				genres,
				movie.genres[index],
			);
		}

		const metaScore = card.querySelector('.meta-score .score');

		const class_name = metaScoreColor(movie.meta_Score);

		metaScore.classList.add(class_name);
		metaScore.textContent = movie.meta_Score;
		card.querySelector('.imdb-score .score .rate').textContent =
			movie.imdb_score;

		card.querySelector('.card-title').textContent = movie.title;
		card.querySelector('.year').textContent = movie.release_Date;

		cardsWrapper.append(card);
	});

	sectionHost.append(section);
}

// FILL GENRES SELECT ELEMENT
function SelectFill(genresData) {
	genresData.forEach((genre) => {
		const opt = document.createElement('option');
		opt.value = genre;
		opt.textContent = genre;
		genresFilterSlectionEl.append(opt);
	});
}

// post Creator

function postArticleCreator(movie) {
	const postArticle = document.importNode(postArticleTemplate.content, true);
	postArticle.querySelector('.poster-box img').src = movie.image_url;
	postArticle.querySelector('.u-rating .score').textContent =
		movie.users_rating;
	postArticle.querySelector('.post-title').textContent = movie.title;

	const genres = postArticle.querySelector('.post-genres');
	for (let index = 0; index < movie.genres.length; index++) {
		const genre = elementsCreator(
			'div',
			'post-genre',
			genres,
			movie.genres[index],
		);
	}

	postArticle.querySelector('.year span').textContent = movie.release_Date;
	postArticle.querySelector('.runtime span').textContent = movie.runtime;
	postArticle.querySelector('.director span').textContent = movie.director;
	const stars = postArticle.querySelector('.stars');
	for (let index = 0; index < movie.actors.length; index++) {
		const actor = elementsCreator(
			'span',
			'actor',
			stars,
			`${movie.actors[index]}, `,
		);
	}
	const class_name = metaScoreColor(movie.meta_Score);
	const metaScore = postArticle.querySelector('.meta-score .score');
	metaScore.classList.add(class_name);
	metaScore.textContent = movie.meta_Score;

	postArticle.querySelector('.imdb-score .rate').textContent = movie.imdb_score;
	postArticle.querySelector('.post__body--overview').textContent =
		movie.overview;
	// postArticle.querySelector('.');

	return postArticle;
}

function loadMoviePosts(moviesData) {
	moviesData.forEach((movie) => {
		const article = postArticleCreator(movie);
		postsContainer.append(article);
	});
}
