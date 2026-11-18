/* ============================================================
   ЭкоНорма BY — интерактив лендинга
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Мобильное меню ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Тень шапки при прокрутке ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Появление блоков при прокрутке ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Подсветка активного пункта меню ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Анимация счётчиков ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (el) => {
    const target = Number(el.dataset.count || 0);
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }

  /* ---------- Заполнение шкалы готовности в кабинете ---------- */
  const gauge = document.querySelector(".gauge");
  if (gauge) {
    const target = 92;
    const start = performance.now() + 350;
    const step = (now) => {
      const t = Math.min(Math.max((now - start) / 1300, 0), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      gauge.style.setProperty("--gauge", String(Math.round(target * eased)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Чек-лист готовности ---------- */
  const boxes = Array.from(document.querySelectorAll(".check-item input"));
  const answerCount = document.getElementById("answerCount");
  const progressFill = document.getElementById("progressFill");
  const checkBtn = document.getElementById("checkBtn");
  const result = document.getElementById("demoResult");
  const resultTitle = document.getElementById("resultTitle");
  const resultScore = document.getElementById("resultScore");
  const resultText = document.getElementById("resultText");
  const protocolBtn = document.getElementById("protocolBtn");
  const protocol = document.getElementById("protocol");

  let latestScore = 0;
  let latestChecks = [];

  const updateProgress = () => {
    const done = boxes.filter((box) => box.checked).length;
    if (answerCount) answerCount.textContent = `${done} / ${boxes.length}`;
    if (progressFill) progressFill.style.width = `${(done / boxes.length) * 100}%`;
    if (result) result.hidden = true;
    if (protocol) protocol.hidden = true;
  };

  boxes.forEach((box) => box.addEventListener("change", updateProgress));
  updateProgress();

  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      const checked = boxes.filter((box) => box.checked);
      latestScore = Math.round((checked.length / boxes.length) * 100);
      latestChecks = checked.map((box) => box.closest(".check-item").querySelector("span:last-child").textContent.trim());

      let title, text;
      if (latestScore === 100) {
        title = "Отличная готовность!";
        text = "Все ключевые документы на месте. Осталось поддержать актуальность записей — сервис сделает это за вас.";
      } else if (latestScore >= 60) {
        title = "Есть куда расти";
        text = "Основа есть, но несколько документов отсутствуют. Именно их чаще всего и запрашивает инспектор.";
      } else {
        title = "Есть серьёзные пробелы";
        text = "Без полного пакета документов проверка обернётся предписанием или штрафом. Начните с паспортов и журнала учёта.";
      }

      resultTitle.textContent = title;
      resultScore.textContent = latestScore + "%";
      resultText.textContent = text;
      result.hidden = false;
      protocol.hidden = true;
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (protocolBtn && protocol) {
    protocolBtn.addEventListener("click", () => {
      const now = new Date().toLocaleString("ru-BY", { dateStyle: "long", timeStyle: "short" });
      const lines = [
        "ПРОТОКОЛ ЭКСПРЕСС-ПРОВЕРКИ ГОТОВНОСТИ",
        "------------------------------------------------------------",
        "Сервис: ЭкоНорма BY (демонстрационный расчёт)",
        "Дата: " + now,
        "Индекс готовности: " + latestScore + "%",
        "",
        "Подтверждено (" + latestChecks.length + "):",
        ...(latestChecks.length ? latestChecks.map((item) => "  [+] " + item) : ["  — нет подтверждений —"]),
        "",
        "Не заполнено (" + (boxes.length - latestChecks.length) + "):",
        ...boxes.filter((b) => !b.checked).map((b) => "  [ ] " + b.closest(".check-item").querySelector("span:last-child").textContent.trim()),
        "",
        "Рекомендация: " + (latestScore === 100
          ? "поддерживать актуальность документов и проходить проверку знаний раз в полгода."
          : "закрыть пропущенные позиции до плановой проверки; установить напоминания в Telegram-боте."),
        "------------------------------------------------------------",
        "Документ сформирован в демо-режиме и не является официальным.",
      ];
      protocol.textContent = lines.join("\n");
      protocol.hidden = false;
      protocol.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ---------- Демо-форма заявки ---------- */
  const leadForm = document.getElementById("leadForm");
  const formNote = document.getElementById("formNote");

  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("email");
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      formNote.classList.toggle("success", valid);
      formNote.textContent = valid
        ? "Спасибо! В демо-версии заявка не отправляется — подключите бэкенд или Telegram-бот."
        : "Проверьте формат e-mail (например, name@company.by).";
      if (valid) leadForm.reset();
    });
  }
})();
