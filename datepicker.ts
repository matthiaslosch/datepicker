class DatePickerElement extends HTMLElement {

    private cells: HTMLElement[] = [];
    private prevMonthButton: HTMLElement;
    private nextMonthButton: HTMLElement;

    private date: Date = new Date(Date.now());

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.render();

        if (this.hasAttribute("month")) {
            const d = Date.parse(this.getAttribute("month") + " 1, 2000");
            if (isNaN(d)) {
                throw "'month' attribute is not a valid month.";
            }
            this.month = new Date(d).getMonth();
        } else {
            this.month = this.date.getMonth();
        }
        if (this.hasAttribute("year")) {
            const year = parseInt(this.getAttribute("year")!, 10);
            if (isNaN(year)) {
                throw "'year' attribute is not a valid year.";
            }
            this.year = year;
        } else {
            this.year = this.date.getFullYear();
        }

        this.prevMonthButton = this.shadowRoot!.getElementById("left-nav")!;
        this.nextMonthButton = this.shadowRoot!.getElementById("right-nav")!;

        const tbody = this.shadowRoot!.getElementById("days");

        for (let row = 0; row < 6; row++) {
            const day_row = document.createElement("tr");

            for (let col = 0; col < 7; col++) {
                const cell = document.createElement("td");
                this.cells.push(cell);

                day_row.appendChild(cell);
            }
            tbody!.appendChild(day_row);
        }

        this.changeMonth();
    }

    private changeMonth() {
        const numDaysInMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
        const monthYearElement = this.shadowRoot!.getElementById("month-year");
        monthYearElement!.innerText = `${this.date.toLocaleString("default", { month: "short" })} ${this.date.getFullYear()}`;

        const currentMonthFirstDay = new Date(this.date);
        currentMonthFirstDay.setDate(1);
        const firstDayOfMonth = currentMonthFirstDay.getDay();
        const firstRowStartIndex = (firstDayOfMonth + 6) % 7; // Starts at 0 for sunday.
        for (let i = 0; i < firstRowStartIndex; ++i) {
            this.cells[i].className = "invisible";
        }

        const numRemainingRows = Math.ceil((numDaysInMonth - (7 - firstRowStartIndex)) / 7);
        const numDaysInLastRow = 7 - ((((numRemainingRows + 1) * 7) - firstRowStartIndex) - numDaysInMonth);
        
        let j = 1;
        for (let i = firstRowStartIndex; i < numDaysInMonth+firstRowStartIndex; i++) {
            this.cells[i].className = "calendarday";
            this.cells[i].innerText = `${j++}`;
        }

        for (let i = (numRemainingRows * 7) + numDaysInLastRow; i < 42; i++) {
            this.cells[i].className = "invisible";
        }
    }

    get month() {
        return this.date.getMonth();
    }

    get year() {
        return this.date.getFullYear();
    }

    set month(value: number) {
        this.date.setMonth(value);
    }

    set year(value: number) {
        this.date.setFullYear(value);
    }

    connectedCallback() {
        this.prevMonthButton.addEventListener("click", e => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.changeMonth();
        });
        this.nextMonthButton.addEventListener("click", e => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.changeMonth();
        });
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <style>
                table {
                    user-select: none;
                }

                th {
                    background-color: #ccd6df;
                }

                td {
                    vertical-align: middle;
                    text-align: center;
                }

                .invisible {
                    visibility: hidden;
                }

                .calendarday {
                    border: #999 1px solid;
                }
            </style>
            <table>
                <thead>
                    <tr id="nav-row">
                        <th id="left-nav" colspan="2">◀</th>
                        <th id="month-year" colspan="3"></th>
                        <th id="right-nav" colspan="2">▶</th>
                    </tr>
                    <tr>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wen</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                        <th>Sun</th>
                    </tr>
                </thead>
                <tbody id="days"></tbody>
            </table>
        `;
    }
}

customElements.define("date-picker", DatePickerElement);
