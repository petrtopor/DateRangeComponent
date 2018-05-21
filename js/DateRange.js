document.componentRegistry = {};
document.nextId = 0;

class Component
{
    constructor()
    {
        this._id = ++document.nextId;
        document.componentRegistry[this._id] = this;
    }
}

class Day extends Component
{
    constructor(week, date)
    {
        super();
        this.week = week;
        this.date = date;
    }
    render()
    {
        return `<div class='day' onclick="document.componentRegistry[${this._id}].week.calendar.pickDate(document.componentRegistry[${this._id}].date)">${this.date.getDate()}</div>`;
    }
}

class Week extends Component
{
    constructor(calendar, startDate)
    {
        super();
        this.calendar = calendar;
        this.daysArray = [];
        this.startDate = startDate;
        this.formDaysArray();
    }

    formDaysArray()
    {
        for (var i = 0; i < 7; i++)
        {
            var date = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() + i);
            var day = new Day(this, date);
            this.daysArray.push(day);
        }
    }

    render()
    {
        return `<div class='week'>${this.daysArray.map((day)=>day.render()).join('')}</div>`;
    }
}

class Calendar extends Component
{
    constructor(dateInput)
    {
        super();
        this.weeksArray = [];
        this.dateInput = dateInput;
        this.date = new Date(dateInput.date);
        this.visible = false;
        this.firstDayOfMonth = new Date(this.date.getFullYear(), this.date.getMonth());
        this.firstMondayOfMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth(), this.firstDayOfMonth.getDate() - this.firstDayOfMonth.getDay()+1);
        if(this.firstMondayOfMonth > this.firstDayOfMonth)
        {
            this.firstMondayOfMonth = new Date(this.firstMondayOfMonth.getFullYear(), this.firstMondayOfMonth.getMonth(), this.firstMondayOfMonth.getDate() - 7);
        }
        this.formWeeksArray();
    }
    formWeeksArray()
    {
        for(var i=0; i<6; i++)
        {
            var startMondayOfWeek = new Date(this.firstMondayOfMonth.getFullYear(), this.firstMondayOfMonth.getMonth(), this.firstMondayOfMonth.getDate() + (7*i));

            var week = new Week(this, startMondayOfWeek);
            this.weeksArray.push(week);
        }
    }
    increaseMonth()
    {
        this.weeksArray = [];
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
        this.firstDayOfMonth = new Date(this.date.getFullYear(), this.date.getMonth());
        this.firstMondayOfMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth(), this.firstDayOfMonth.getDate() - this.firstDayOfMonth.getDay()+1);
        if(this.firstMondayOfMonth > this.firstDayOfMonth)
        {
            //alert("this.firstMondayOfMonth > this.firstDayOfMonth");
            var tmp = new Date(this.firstMondayOfMonth.getFullYear(), this.firstMondayOfMonth.getMonth(), this.firstMondayOfMonth.getDate() - 7);
            this.firstMondayOfMonth = tmp;
        }
        this.formWeeksArray();
        document.applicationDispatcher.update();
    }
    decreaseMonth()
    {
        this.weeksArray = [];
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
        this.firstDayOfMonth = new Date(this.date.getFullYear(), this.date.getMonth());
        this.firstMondayOfMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth(), this.firstDayOfMonth.getDate() - this.firstDayOfMonth.getDay()+1);
        if(this.firstMondayOfMonth > this.firstDayOfMonth)
        {
            var tmp = new Date(this.firstMondayOfMonth.getFullYear(), this.firstMondayOfMonth.getMonth(), this.firstMondayOfMonth.getDate() - 7);
            this.firstMondayOfMonth = tmp;
        }
        this.formWeeksArray();
        document.applicationDispatcher.update();
    }
    pickDate(date)
    {
        this.date = date;
        this.dateInput.date = this.date;
        document.applicationDispatcher.update();
    }
    test()
    {
        alert("TEST ARROW");
    }
    render()
    {
        console.log("calendarHolder");
        return `
                <div id="calendarHolder" style = "display:${this.visible?'flex':'none'}">
                    <div id="calendarHeader">
                        <div id="leftArrow" onclick="document.componentRegistry[${this._id}].decreaseMonth()">
                            &larr;
                        </div>
                        <div id="headerContent">
                            ${this.dateInput.dateRangeComponent.months[this.date.getMonth()]}
                        </div>
                        <div id="rightArrow" onclick="document.componentRegistry[${this._id}].increaseMonth()">
                            &rarr;
                        </div>
                    </div>
                    <div id="calendarBody">
                        <div id="daysCaptions">
                            <div class="dayCaption">
                                Пн
                            </div>
                            <div class="dayCaption">
                                Вт
                            </div>
                            <div class="dayCaption">
                                Ср
                            </div>
                            <div class="dayCaption">
                                Чт
                            </div>
                            <div class="dayCaption">
                                Пт
                            </div>
                            <div class="dayCaption">
                                Сб
                            </div>
                            <div class="dayCaption">
                                Вс
                            </div>
                        </div>
                        <div id="weeksHolder">
                            ${this.weeksArray.map((week)=>week.render()).join('')}
                        </div>
                    </div>
                </div>
                `;
    }
    show()
    {
        this.visible = true;
        //this.render();
    }
    hide()
    {
        this.visible = false;
        //this.render();
    }
    toggleVisibility()
    {
        this.visible?this.hide():this.show();
    }
}

class StartDateInput extends Component
{
    constructor(dateRangeComponent)//The parent DateRangeComponent where days' names and months' names to take and to which this input belongs to
    {
        super();
        this.dateRangeComponent = dateRangeComponent;
        this.date = new Date();
        this.calendar = new Calendar(this);
    }

    testF()
    {
        document.componentRegistry[this.calendar._id].toggleVisibility();
        //this.render();
        document.applicationDispatcher.update();
    }

    render()
    {
        console.log("StartDateHolder");
        return `
                <div class='StartDateHolder'>
                    <input class='StartDateInput' value="${this.dateRangeComponent.days[this.date.getDay()]} - ${this.date.getDate()} of ${this.dateRangeComponent.months[this.date.getMonth()]} ${this.date.getFullYear()}" onclick="document.componentRegistry[${this._id}].testF()">
                    ${this.calendar.render()}
                </div>
                `;
    }
}

class EndDateInput extends Component
{
    constructor(dateRangeComponent)//The parent DateRangeComponent where days' names and months' names to take and to which this input belongs to
    {
        super();
        this.dateRangeComponent = dateRangeComponent;
        this.date = new Date();
        this.calendar = new Calendar(this);
    }

    testF()
    {
        document.componentRegistry[this.calendar._id].toggleVisibility();
        //this.render();
        document.applicationDispatcher.update();
    }

    render()
    {
        console.log("EndDateHolder");
        return `
                <div class='EndDateHolder'>
                    <input class='EndDateInput' value="${this.dateRangeComponent.days[this.date.getDay()]} - ${this.date.getDate()} of ${this.dateRangeComponent.months[this.date.getMonth()]} ${this.date.getFullYear()}" onclick="document.componentRegistry[${this._id}].testF()">
                    ${this.calendar.render()}
                </div>`;
    }
}

class DateRangeComponent extends Component
{
    //constructor(elementToAttach)
    constructor()
    {
        super();
        this.dateInputs = [];

        this.days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
        this.months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];


        //this.elementToAttach=elementToAttach;
        this.startDateInput = new StartDateInput(this);
        this.endDateInput = new EndDateInput(this);

        this.dateInputs.push(this.startDateInput);
        this.dateInputs.push(this.endDateInput);
    }
    render()
    {
        console.log("DateRangeComponent");
        return `${this.dateInputs.map((dateInput) => dateInput.render()).join('')}`;
    }
    getRange()
    {
        if(this.startDateInput.date < this.endDateInput.date)
        {
            var dateRange = {};
            dateRange.start = this.startDateInput.date;
            dateRange.end = this.endDateInput.date;
            return dateRange;
        }
    }
}
class ApplicationDispatcher
{
    constructor()
    {
        this.dateRangeComponentsHolders = [];//Array of DOM holders
        this.dateRangeComponents = [];//Array of JS-drc-objects
        /*
        for(var i = 0; i < document.getElementsByClassName("DateRangeComponentHolder").length; i ++)
        {
            //var drc = new DateRangeComponent(document.getElementsByClassName("DateRangeComponentHolder")[i]);
            var drc = new DateRangeComponent();
            document.getElementsByClassName("DateRangeComponentHolder")[i].innerHTML = drc.render();
        }
        */
        for(var i = 0; i < document.getElementsByClassName("DateRangeComponentHolder").length; i ++)
        {
            this.dateRangeComponentsHolders.push(document.getElementsByClassName("DateRangeComponentHolder")[i]);
        }
        for(var i = 0; i < this.dateRangeComponentsHolders.length; i ++)
        {
            var drc = new DateRangeComponent();
            this.dateRangeComponents.push(drc);
        }
        for(var i = 0; i < this.dateRangeComponentsHolders.length; i ++)
        {
            this.dateRangeComponentsHolders[i].innerHTML = this.dateRangeComponents[i].render();
        }
    }
    update()
    {
        for(var i = 0; i < this.dateRangeComponentsHolders.length; i ++)
        {
            this.dateRangeComponentsHolders[i].innerHTML = this.dateRangeComponents[i].render();
        }
    }
}

window.onload = function()
{
    document.applicationDispatcher = new ApplicationDispatcher();
};