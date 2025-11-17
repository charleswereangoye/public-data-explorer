const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');
const indicatorSelect = document.getElementById('indicator');
const countryName = document.getElementById('countryName');
const errorDiv = document.getElementById('error');
let chart;

/* Mapping readable titles for dynamic axis labels */
const indicatorTitles = {
    "SP.POP.TOTL": "Population",
    "NY.GDP.PCAP.CD": "GDP per Capita (USD)",
    "SP.DYN.LE00.IN": "Life Expectancy (Years)"
};

async function fetchCountries() {
    const resp = await fetch('/api/countries');
    if (!resp.ok) throw new Error('Failed to load countries');
    const json = await resp.json();
    return json[1];
}

async function fetchIndicator(code, countryCode) {
    const resp = await fetch(`/api/indicator/${code}/${countryCode}`);
    if (!resp.ok) throw new Error('Failed to fetch indicator');
    return resp.json();
}

async function onSearch() {
    errorDiv.textContent = '';
    countryName.textContent = 'Loading...';

    try {
        const countries = await fetchCountries();
        const q = searchInput.value.trim().toLowerCase();

        const country = countries.find(
            c => c.name.toLowerCase() === q || c.iso2Code.toLowerCase() === q
        );

        if (!country) {
            countryName.textContent = 'Country not found';
            return;
        }

        countryName.textContent = country.name;

        // Selected indicator
        const indicatorCode = indicatorSelect.value;
        const indicatorName = indicatorTitles[indicatorCode];

        const data = await fetchIndicator(indicatorCode, country.id);

        const raw = data[1] || [];
        const labels = raw.map(x => x.date).reverse();
        const values = raw.map(x => x.value ?? null).reverse();

        drawChart(labels, values, indicatorName, country.name);

    } catch (err) {
        console.error(err);
        errorDiv.textContent = err.message;
        countryName.textContent = '—';
    }
}

function drawChart(labels, values, indicatorName, country) {
    const ctx = document.getElementById('chart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${indicatorName} — ${country}`,
                data: values,
                borderWidth: 2,
                borderColor: '#007bff',
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Year",
                        font: { size: 14, weight: 'bold' }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: indicatorName,
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        }
    });
}

searchBtn.addEventListener('click', onSearch);

