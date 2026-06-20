// инициализация карты
ymaps.ready(initMap);

var myMap;
var placemarks = [];
var courtyardsData = [];

function initMap() {
  myMap = new ymaps.Map("map", {
    center: [59.9343, 30.3351],
    zoom: 13,
    controls: ['zoomControl', 'fullscreenControl']
  });
  // массив с дворами
  courtyardsData = [
    {
      coords: [59.928045, 30.342952],
      title: 'Рубинштейна, 23',
      description: 'Конструктивизм',
      style: 'constructivism',
      district: 'central'
    },
    {
      coords: [59.939077, 30.276064],
      title: '11-я линия В.О., 20',
      description: 'Модерн',
      style: 'modern',
      district: 'vasilevskiy'
    },
    {
      coords: [59.960359, 30.302771],
      title: 'Большой проспект П.С., 52',
      description: 'Эклектицизм',
      style: 'eclecticism',
      district: 'petrogradskaya'
    },
    {
      coords: [59.933018, 30.347363],
      title: 'Невский проспект, 74',
      description: 'Конструктивизм',
      style: 'constructivism',
      district: 'central'
    },
    {
      coords: [59.935638, 30.361673],
      title: 'Жуковского, 57',
      description: 'Эклектицизм',
      style: 'eclecticism',
      district: 'central'
    },
    {
      coords: [59.936892, 30.345721],
      title: 'Литейный проспект, 61',
      description: 'Эклектицизм',
      style: 'eclecticism',
      district: 'central'
    },
    {
      coords: [59.938234, 30.351892],
      title: 'Белинского, 7',
      description: 'Эклектицизм',
      style: 'eclecticism',
      district: 'central'
    },
    {
      coords: [59.938076, 30.360065],
      title: 'Восстания, 22',
      description: 'Эклектицизм',
      style: 'eclecticism',
      district: 'central'
    },
    {
      coords: [59.941060, 30.284831],
      title: '4-я линия В.О., 7',
      description: 'Эклектицизм',
      style: 'eclecticism',
      district: 'vasilevskiy'
    },
    {
      coords: [59.968637, 30.308493],
      title: 'Каменноостровский проспект, 44Б',
      description: 'Эклектицизм',
      style: 'eclecticism',
      district: 'petrogradskaya'
    },
    {
      coords: [59.950276, 30.298324],
      title: 'проспект Добролюбова, 21А',
      description: 'Модерн',
      style: 'modern',
      district: 'petrogradskaya'
    }
  ];

  addPlacemarks(courtyardsData);
}

// удаляем метки, очищаем массив
function addPlacemarks(data) {
  placemarks.forEach(function(pm) {
    myMap.geoObjects.remove(pm);
  });
  placemarks = [];

  // балун метка
  data.forEach(function(courtyard) {
    var myPlacemark = new ymaps.Placemark(courtyard.coords, {
      hintContent: courtyard.title,
      balloonContent: '<strong>' + courtyard.title + '</strong><br>' + courtyard.description
    }, {
      preset: 'islands#blueHouseIcon',
      iconColor: '#1B98D7'
    });

    myPlacemark.events.add('click', function(e) {
      myMap.setCenter(courtyard.coords, 16, {
        duration: 400
      });
      
      setTimeout(function() {
        myPlacemark.balloon.open();
      }, 400);
    });

    myMap.geoObjects.add(myPlacemark);
    placemarks.push(myPlacemark);
  });
}

// фильтрация карты
function applyMapFilters() {
  const selectedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked'))
    .map(cb => cb.value);
  
  const selectedDistricts = Array.from(document.querySelectorAll('input[name="district"]:checked'))
    .map(cb => cb.value);
  
  if (selectedStyles.length === 0 && selectedDistricts.length === 0) {
    addPlacemarks(courtyardsData);
    return;
  }
  
  const filteredCourtyards = courtyardsData.filter(function(courtyard) {
    const matchesStyle = selectedStyles.length === 0 || selectedStyles.includes(courtyard.style);
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(courtyard.district);
    
    return matchesStyle && matchesDistrict;
  });
  
  addPlacemarks(filteredCourtyards);
}

// выпадающие списки
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
    applyMapFilters();
  });
});

// сброс фильтров
function resetAllFilters() {
  document.querySelectorAll('.filter-dropdown__item input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  document.querySelectorAll('.filter-dropdown').forEach(el => {
    el.classList.remove('active');
    el.querySelector('.filter-arrow').style.transform = 'rotate(0deg)';
  });
  
  addPlacemarks(courtyardsData);
}