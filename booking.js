// MEMBERS 3 & 4: MOVIE BOOKING + ADMIN DASHBOARD
// Member 3: movie listing, search, seat selection and customer tickets.
// Member 4: admin statistics, movie management and all booking records.

// -------------------- MOVIE DATA & LOCAL STORAGE --------------------

function getMovies() {
  const saved = localStorage.getItem("cinebook_movies");
  if (saved) return JSON.parse(saved);

  const defaults = [
    {id:1,title:"Dune: Part Two",genre:"Sci-Fi",duration:"2h 46m",price:220,poster:"https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",description:"A mythic journey across the desert, where destiny and power collide."},
    {id:2,title:"Oppenheimer",genre:"Drama",duration:"3h 00m",price:200,poster:"https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",description:"The story of the scientist whose work changed the world forever."},
    {id:3,title:"Spider-Man: Across the Spider-Verse",genre:"Adventure",duration:"2h 20m",price:190,poster:"https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5XjarrhS.jpg",description:"Miles Morales swings into a multiverse of possibilities."},
    {id:4,title:"The Batman",genre:"Action",duration:"2h 56m",price:210,poster:"https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",description:"A dark new chapter begins on the streets of Gotham."},
    {id:5,title:"Jawan",genre:"Action",duration:"2h 49m",price:180,poster:"https://image.tmdb.org/t/p/w500/jFt1gS4BGHt1jLRlT9M9V9q8Ww.jpg",description:"A high-octane action thriller with a mission bigger than one man."},
    {id:6,title:"Interstellar",genre:"Sci-Fi",duration:"2h 49m",price:190,poster:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6Mxbe5Iev.jpg",description:"A team travels beyond this galaxy to discover a future for humanity."},
    {id:7,title:"La La Land",genre:"Drama",duration:"2h 08m",price:170,poster:"https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",description:"Two dreamers find love while chasing their own Hollywood dreams."},
    {id:8,title:"The Grand Budapest Hotel",genre:"Comedy",duration:"1h 39m",price:160,poster:"https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",description:"An unusual hotel concierge and his lobby boy embark on an adventure."}
  ];

  localStorage.setItem("cinebook_movies", JSON.stringify(defaults));
  return defaults;
}

function saveMovies(movies) {
  localStorage.setItem("cinebook_movies", JSON.stringify(movies));
}

function getBookings() {
  return JSON.parse(localStorage.getItem("cinebook_bookings") || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem("cinebook_bookings", JSON.stringify(bookings));
}

function renderApp() {
  renderMovies();

  if (currentRole === "admin") {
    renderDashboard();
    renderAdminMovies();
    renderAllBookings();
  } else if (currentRole === "user") {
    renderMyBookings();
  }
}

// -------------------- MEMBER 3: CUSTOMER MOVIE BOOKING --------------------

function renderMovies() {
  const grid = document.getElementById("movieGrid");
  if (!grid) return;

  const term = (document.getElementById("searchMovies")?.value || "").toLowerCase();
  const genre = document.getElementById("genreFilter")?.value || "all";

  const movies = getMovies().filter(movie =>
    (movie.title.toLowerCase().includes(term) || movie.genre.toLowerCase().includes(term)) &&
    (genre === "all" || movie.genre === genre)
  );

  grid.innerHTML = movies.length
    ? movies.map(movie => `
      <article class="movie-card" onclick="openBooking(${movie.id})">
        <div class="poster-wrap">
          <img src="${escapeHTML(movie.poster)}" alt="${escapeHTML(movie.title)}"
            onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91a9c7d0f?auto=format&fit=crop&w=500&q=80'">
          <div class="poster-overlay"><span>BOOK YOUR SEAT →</span></div>
        </div>
        <div class="movie-info">
          <h3>${escapeHTML(movie.title)}</h3>
          <div class="movie-meta">
            <span>${escapeHTML(movie.genre)} · ${escapeHTML(movie.duration)}</span>
            <span class="movie-price">₹${movie.price}</span>
          </div>
        </div>
      </article>`).join("")
    : `<div class="empty-state">No movies found. Try another search.</div>`;
}

document.getElementById("searchMovies").addEventListener("input", renderMovies);
document.getElementById("genreFilter").addEventListener("change", renderMovies);

document.getElementById("exploreBtn").addEventListener("click", () => {
  document.getElementById("movieSection").scrollIntoView({ behavior: "smooth" });
});

function renderMyBookings() {
  const mine = getBookings().filter(booking => booking.username === currentUsername);
  const box = document.getElementById("myBookingList");

  box.innerHTML = mine.length
    ? mine.slice().reverse().map(booking => `
      <div class="ticket">
        <img src="${escapeHTML(booking.poster)}" onerror="this.style.display='none'">
        <div class="ticket-main">
          <h3>${escapeHTML(booking.movie)}</h3>
          <p>${escapeHTML(booking.date)} · ${booking.seats.length} seat(s): ${booking.seats.join(", ")}</p>
          <p>Paid: ₹${booking.total}</p>
        </div>
        <div class="ticket-code">#${booking.id}</div>
      </div>`).join("")
    : `<div class="empty-state"><b>No tickets yet</b>Your next movie night is waiting. Head to Discover and book a seat.</div>`;
}

function openBooking(id) {
  if (currentRole !== "user") return;

  const movie = getMovies().find(item => item.id === id);
  if (!movie) return;

  const bookedSeats = getBookings()
    .filter(booking => booking.movieId === id)
    .flatMap(booking => booking.seats);

  document.getElementById("bookingContent").innerHTML = `
    <p class="eyebrow">MAKE IT A MOVIE NIGHT</p>
    <h2>${escapeHTML(movie.title)}</h2>
    <div class="booking-poster">
      <img src="${escapeHTML(movie.poster)}">
      <div>
        <b>${escapeHTML(movie.genre)} · ${escapeHTML(movie.duration)}</b>
        <p>${escapeHTML(movie.description || "A great story on the big screen.")}</p>
        <span class="movie-price">₹${movie.price} / seat</span>
      </div>
    </div>
    <div class="screen-label">SCREEN THIS WAY</div>
    <div class="screen"></div>
    <div id="seatGrid" class="seat-grid">
      ${Array.from({length:32}, (_, index) => {
        const seat = String.fromCharCode(65 + Math.floor(index / 8)) + (index % 8 + 1);
        return `<button class="seat ${bookedSeats.includes(seat) ? "booked" : ""}"
          ${bookedSeats.includes(seat) ? "disabled" : ""} data-seat="${seat}">${seat}</button>`;
      }).join("")}
    </div>
    <div class="seat-legend">
      <span><i class="legend-box"></i>Available</span>
      <span><i class="legend-box sel"></i>Selected</span>
      <span><i class="legend-box taken"></i>Booked</span>
    </div>
    <div class="booking-bottom">
      <div><small class="muted">TOTAL AMOUNT</small><br><b id="bookingTotal">₹0</b></div>
      <button class="primary-btn" id="confirmBooking">Confirm booking →</button>
    </div>`;

  document.querySelectorAll(".seat:not(.booked)").forEach(seatButton => {
    seatButton.addEventListener("click", () => {
      seatButton.classList.toggle("selected");
      updateTotal(movie.price);
    });
  });

  document.getElementById("confirmBooking").addEventListener("click", () => {
    confirmBooking(movie);
  });

  document.getElementById("bookingModal").classList.remove("hidden");
}

function updateTotal(price) {
  const count = document.querySelectorAll(".seat.selected").length;
  document.getElementById("bookingTotal").textContent = "₹" + (count * price);
}

function confirmBooking(movie) {
  const seats = [...document.querySelectorAll(".seat.selected")]
    .map(seat => seat.dataset.seat);

  if (!seats.length) {
    alert("Please select at least one seat.");
    return;
  }

  const bookings = getBookings();
  const ticketId = "CB" + Date.now().toString().slice(-7);

  bookings.push({
    id: ticketId,
    username: currentUsername,
    movieId: movie.id,
    movie: movie.title,
    poster: movie.poster,
    seats,
    total: seats.length * movie.price,
    date: new Date().toLocaleString("en-IN")
  });

  saveBookings(bookings);
  document.getElementById("bookingModal").classList.add("hidden");
  alert("Booking confirmed! Your ticket ID is " + ticketId);
  renderApp();
  showPage("myBookings");
}

// -------------------- MEMBER 4: ADMIN DASHBOARD --------------------

function renderDashboard() {
  const bookings = getBookings();

  document.getElementById("statBookings").textContent = bookings.length;
  document.getElementById("statRevenue").textContent =
    "₹" + bookings.reduce((sum, booking) => sum + booking.total, 0).toLocaleString("en-IN");
  document.getElementById("statMovies").textContent = getMovies().length;
  document.getElementById("statSeats").textContent =
    bookings.reduce((sum, booking) => sum + booking.seats.length, 0);

  const recent = document.getElementById("recentBookings");
  const latest = bookings.slice(-5).reverse();

  recent.innerHTML = latest.length
    ? latest.map(booking => `
      <div class="recent-row">
        <b>${escapeHTML(booking.movie)}</b>
        <span>${escapeHTML(booking.username)} · ${booking.seats.length} seat(s)</span>
        <strong>₹${booking.total}</strong>
      </div>`).join("")
    : `<div class="empty-state">No bookings yet. Customer bookings will appear here.</div>`;
}

function renderAdminMovies() {
  const box = document.getElementById("adminMovieList");
  if (!box) return;

  box.innerHTML = getMovies().map(movie => `
    <div class="admin-movie-row">
      <img src="${escapeHTML(movie.poster)}">
      <div class="grow">
        <b>${escapeHTML(movie.title)}</b>
        <small>${escapeHTML(movie.genre)} · ${escapeHTML(movie.duration)} · ₹${movie.price}</small>
      </div>
      <button class="text-btn" onclick="editMovie(${movie.id})">Edit</button>
      <button class="text-btn" onclick="deleteMovie(${movie.id})">Delete</button>
    </div>`).join("");
}

function renderAllBookings() {
  const box = document.getElementById("allBookingTable");
  const bookings = getBookings().slice().reverse();

  box.innerHTML = bookings.length
    ? `<table class="data-table">
        <thead><tr>
          <th>BOOKING ID</th><th>CUSTOMER</th><th>MOVIE</th>
          <th>SEATS</th><th>AMOUNT</th><th>STATUS</th>
        </tr></thead>
        <tbody>
          ${bookings.map(booking => `
            <tr>
              <td>${booking.id}</td>
              <td>${escapeHTML(booking.username)}</td>
              <td>${escapeHTML(booking.movie)}</td>
              <td>${booking.seats.join(", ")}</td>
              <td>₹${booking.total}</td>
              <td><span class="status">Confirmed</span></td>
            </tr>`).join("")}
        </tbody>
      </table>`
    : `<div class="empty-state">No bookings have been made yet.</div>`;
}

function openMovieForm(movie = null) {
  document.getElementById("movieForm").reset();
  document.getElementById("editMovieId").value = movie ? movie.id : "";
  document.getElementById("movieModalTitle").textContent = movie ? "Edit movie" : "Add a movie";

  if (movie) {
    document.getElementById("movieTitle").value = movie.title;
    document.getElementById("movieGenre").value = movie.genre;
    document.getElementById("movieDuration").value = movie.duration;
    document.getElementById("moviePoster").value = movie.poster;
    document.getElementById("movieDescription").value = movie.description || "";
    document.getElementById("moviePrice").value = movie.price;
  }

  document.getElementById("movieModal").classList.remove("hidden");
}

function editMovie(id) {
  openMovieForm(getMovies().find(movie => movie.id === id));
}

function deleteMovie(id) {
  if (!confirm("Remove this movie from the lineup?")) return;
  saveMovies(getMovies().filter(movie => movie.id !== id));
  renderApp();
}

document.getElementById("addMovieBtn").addEventListener("click", () => openMovieForm());

document.getElementById("quickAddMovie").addEventListener("click", () => {
  showPage("manageMovies");
  openMovieForm();
});

document.getElementById("movieForm").addEventListener("submit", event => {
  event.preventDefault();

  const movies = getMovies();
  const editId = document.getElementById("editMovieId").value;

  const movie = {
    id: editId ? Number(editId) : Date.now(),
    title: document.getElementById("movieTitle").value.trim(),
    genre: document.getElementById("movieGenre").value,
    duration: document.getElementById("movieDuration").value.trim(),
    poster: document.getElementById("moviePoster").value.trim(),
    description: document.getElementById("movieDescription").value.trim(),
    price: Number(document.getElementById("moviePrice").value)
  };

  if (editId) {
    const index = movies.findIndex(item => item.id === Number(editId));
    movies[index] = movie;
  } else {
    movies.push(movie);
  }

  saveMovies(movies);
  document.getElementById("movieModal").classList.add("hidden");
  renderApp();
});

// -------------------- SHARED HELPERS --------------------

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.close).classList.add("hidden");
  });
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) modal.classList.add("hidden");
  });
});

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}
