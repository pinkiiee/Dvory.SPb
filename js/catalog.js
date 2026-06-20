// открыть закрыть выпадающий список
function toggleDropdown(type) {
  const dropdown = document.getElementById(`${type}-filter`);
  const arrow = dropdown.querySelector('.filter-arrow');
  
  dropdown.classList.toggle('active');
  
  if (dropdown.classList.contains('active')) {
    arrow.style.transform = 'rotate(180deg)';
  } else {
    arrow.style.transform = 'rotate(0deg)';
  }
  
  document.querySelectorAll('.filter-dropdown').forEach(el => {
    if (el.id !== `${type}-filter`) {
      el.classList.remove('active');
      el.querySelector('.filter-arrow').style.transform = 'rotate(0deg)';
    }
  });
}

// для клика мимо фильтрации
document.addEventListener('click', (e) => {
  if (!e.target.closest('.filter-dropdown')) {
    document.querySelectorAll('.filter-dropdown').forEach(el => {
      el.classList.remove('active');
      el.querySelector('.filter-arrow').style.transform = 'rotate(0deg)';
    });
  }
});

document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

document.querySelectorAll('.filter-dropdown__item input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    applyFilters();
  });
});

// сбор всех фильтров в массив
function applyFilters() {
  const selectedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked'))
    .map(cb => cb.value);
  
  const selectedDistricts = Array.from(document.querySelectorAll('input[name="district"]:checked'))
    .map(cb => cb.value);
  
  console.log('Выбранные стили:', selectedStyles);
  console.log('Выбранные районы:', selectedDistricts);
  
  // если ничего не ывбрано, то все карточки
  if (selectedStyles.length === 0 && selectedDistricts.length === 0) {
    document.querySelectorAll('.favorite-card').forEach(card => {
      card.style.display = 'block';
    });
    return;
  }
  
  // если выбрано, то проверка карточек
  document.querySelectorAll('.favorite-card').forEach(card => {
    const cardStyle = card.dataset.style;
    const cardDistrict = card.dataset.district;
    
    const matchesStyle = selectedStyles.length === 0 || selectedStyles.includes(cardStyle);
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(cardDistrict);
    
    if (matchesStyle && matchesDistrict) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// сброс фильтров (убрать галочки)
function resetAllFilters() {
  document.querySelectorAll('.filter-dropdown__item input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // показать карточки
  document.querySelectorAll('.favorite-card').forEach(card => {
    card.style.display = 'block';
  });
  
  //закрыть открыты списки
  document.querySelectorAll('.filter-dropdown').forEach(el => {
    el.classList.remove('active');
    el.querySelector('.filter-arrow').style.transform = 'rotate(0deg)';
  });

  console.log('Все фильтры сброшены');
}

// пагинация (только визуал)
document.querySelectorAll('.pagination__number').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.pagination__number').forEach(btn => {
      btn.classList.remove('pagination__number--active');
    });
    
    this.classList.add('pagination__number--active');
  });
});

// добавить в избранное (сердечко)
document.querySelectorAll('.favorite-card__favorite').forEach(button => {
  button.addEventListener('click', function(e) {
    e.stopPropagation();
    
    const icon = this.querySelector('.favorite-icon');
    
    if (this.classList.contains('is-active')) {
      this.classList.remove('is-active');
      icon.src = 'images/heart.svg'; 
    } else {
      this.classList.add('is-active');
      icon.src = 'images/heart_active.svg';
    }
  });
});