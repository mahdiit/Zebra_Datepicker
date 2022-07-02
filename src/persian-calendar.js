function mod(a, b) {
    return a - (b * Math.floor(a / b));
}
/*
JavaScript functions for the Fourmilab Calendar Converter

by John Walker  --  September, MIM
http://www.fourmilab.ch/documents/calendar/

This program is in the public domain.
*/
function leap_gregorian(year) {
    return ((year % 4) == 0) && (!(((year % 100) == 0) && ((year % 400) != 0)));
}
var GREGORIAN_EPOCH = 1721425.5;

function gregorian_to_jd(year, month, day) {
    return (GREGORIAN_EPOCH - 1) + (365 * (year - 1)) + Math.floor((year - 1) / 4) + (-Math.floor((year - 1) / 100)) + Math.floor((year - 1) / 400) + Math.floor((((367 * month) - 362) / 12) + ((month <= 2) ? 0 : (leap_gregorian(year) ? -1 : -2)) + day);
}

function jd_to_gregorian(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, dyindex, year, yearday, leapadj;
    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0 : (leap_gregorian(year) ? 1 : 2));
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day = (wjd - gregorian_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

function leap_islamic(year) {
    return (((year * 11) + 14) % 30) < 11;
}
var ISLAMIC_EPOCH = 1948439.5;

function islamic_to_jd(year, month, day) {
    return (day + Math.ceil(29.5 * (month - 1)) + (year - 1) * 354 + Math.floor((3 + (11 * year)) / 30) + ISLAMIC_EPOCH) - 1;
}

function jd_to_islamic(jd) {
    var year, month, day;
    jd = Math.floor(jd) + 0.5;
    year = Math.floor(((30 * (jd - ISLAMIC_EPOCH)) + 10646) / 10631);
    month = Math.min(12, Math.ceil((jd - (29 + islamic_to_jd(year, 1, 1))) / 29.5) + 1);
    day = (jd - islamic_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

function leap_persian(year) {
    return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
}
var PERSIAN_EPOCH = 1948320.5;

function persian_to_jd(year, month, day) {
    var epbase, epyear;
    epbase = year - ((year >= 0) ? 474 : 473);
    epyear = 474 + mod(epbase, 2820);
    return day + ((month <= 7) ? ((month - 1) * 31) : (((month - 1) * 30) + 6)) + Math.floor(((epyear * 682) - 110) / 2816) + (epyear - 1) * 365 + Math.floor(epbase / 2820) * 1029983 + (PERSIAN_EPOCH - 1);
}

function jd_to_persian(jd) {
    var year, month, day, depoch, cycle, cyear, ycycle,
        aux1, aux2, yday;
    jd = Math.floor(jd) + 0.5;
    depoch = jd - persian_to_jd(475, 1, 1);
    cycle = Math.floor(depoch / 1029983);
    cyear = mod(depoch, 1029983);
    if (cyear == 1029982) {
        ycycle = 2820;
    } else {
        aux1 = Math.floor(cyear / 366);
        aux2 = mod(cyear, 366);
        ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) + aux1 + 1;
    }
    year = ycycle + (2820 * cycle) + 474;
    if (year <= 0) {
        year--;
    }
    yday = (jd - persian_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day = (jd - persian_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

function JalaliDate(p0, p1, p2) {

    //console.log(p0, p1, p2);

    //fix day > 31 or negative
    if (p2 <= 0) {
        while (p2 <= 0) {
            p1--;
            if (p1 == 11 && !leap_persian(p0)) p2 += 29;
            else if (p1 <= 5) p2 += 31;
            else p2 += 30;
        }
    } else if (p2 > 31) {
        while (p2 > 31) {
            if (p1 == 11 && !leap_persian(p0)) p2 -= 29;
            else if (p1 <= 5) p2 -= 31;
            else p2 -= 30;
            p1++;
        }
    }

    //fix month > 31 or negative
    if (p1 < 0) {
        while (p1 < 0) {
            p0--;
            p1 += 12;
        }
    } else if (p1 > 11) {
        while (p1 > 11) {
            p1 -= 12;
            p0++;
        }
    }

    //console.log(p0, p1, p2);

    var gregorianDate;
    var jalaliDate;
    if (!isNaN(parseInt(p0)) && !isNaN(parseInt(p1)) && !isNaN(parseInt(p2))) {
        var g = jalali_to_gregorian([parseInt(p0, 10), parseInt(p1, 10), parseInt(p2, 10)]);
        setFullDate(new Date(g[0], g[1], g[2]));
    } else {
        setFullDate(p0);
    }

    function jalali_to_gregorian(d) {
        var adjustDay = 0;
        if (d[1] < 0) {
            adjustDay = leap_persian(d[0] - 1) ? 30 : 29;
            d[1]++;
        }
        var gregorian = jd_to_gregorian(persian_to_jd(d[0], d[1] + 1, d[2]) - adjustDay);
        gregorian[1]--;
        return gregorian;
    }

    function gregorian_to_jalali(d) {
        var jalali = jd_to_persian(gregorian_to_jd(d[0], d[1] + 1, d[2]));
        jalali[1]--;
        return jalali;
    }

    function setFullDate(date) {
        if (date && date.getGregorianDate) date = date.getGregorianDate();
        gregorianDate = new Date(date);
        gregorianDate.setHours(gregorianDate.getHours() > 12 ? gregorianDate.getHours() + 2 : 0)
        if (!gregorianDate || gregorianDate == 'Invalid Date' || isNaN(gregorianDate || !gregorianDate.getDate())) {
            gregorianDate = new Date();
        }
        jalaliDate = gregorian_to_jalali([
            gregorianDate.getFullYear(),
            gregorianDate.getMonth(),
            gregorianDate.getDate()
        ]);
        return this;
    }
    this.getGregorianDate = function () {
        return gregorianDate;
    }
    this.setFullDate = setFullDate;
    this.setMonth = function (e) {
        jalaliDate[1] = e;
        var g = jalali_to_gregorian(jalaliDate);
        gregorianDate = new Date(g[0], g[1], g[2]);
        jalaliDate = gregorian_to_jalali([g[0], g[1], g[2]]);
    }
    this.setDate = function (e) {
        jalaliDate[2] = e;
        var g = jalali_to_gregorian(jalaliDate);
        gregorianDate = new Date(g[0], g[1], g[2]);
        jalaliDate = gregorian_to_jalali([g[0], g[1], g[2]]);
    };
    this.getFullYear = function () {
        return jalaliDate[0];
    };
    this.getMonth = function () {
        return jalaliDate[1];
    };
    this.getDate = function () {
        return jalaliDate[2];
    };
    this.toString = function () {
        return jalaliDate.join(',')
            .toString();
    };
    this.getDay = function () {
        return gregorianDate.getDay();
    };
    this.getHours = function () {
        return gregorianDate.getHours();
    };
    this.getMinutes = function () {
        return gregorianDate.getMinutes();
    };
    this.getSeconds = function () {
        return gregorianDate.getSeconds();
    };
    this.getTime = function () {
        return gregorianDate.getTime();
    };
    this.getTimeZoneOffset = function () {
        return gregorianDate.getTimeZoneOffset();
    };
    this.getYear = function () {
        return jalaliDate[0] % 100;
    };
    this.setHours = function (e) {
        gregorianDate.setHours(e);
    };
    this.setMinutes = function (e) {
        gregorianDate.setMinutes(e);
    };
    this.setSeconds = function (e) {
        gregorianDate.setSeconds(e);
    };
    this.setMilliseconds = function (e) {
        gregorianDate.setMilliseconds(e);
    };
}

var datepicker_fa_IR = {
    calendar: JalaliDate,
    months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    days: ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
    months_abbr: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    days_abbr: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
    first_day_of_week: 6,
    weekend_days: [5],
    format: 'Y/m/d',
    lang_clear_date: 'پاک کردن',
    readonly_element: false,
    show_select_today: 'امروز',
    //offset: [2, 230],
    open_icon_only: true,
    rtl:true
};
var datepicker_en_US = {
    first_day_of_week: 6,
    weekend_days: [5],
    readonly_element: false,
    offset: [2, 230],
    open_icon_only: true
};
var PDateValidation = function (s, e) {
    if (!e.value || e.value === '    /  /' || e.value == undefined || e.value === '') {
        if (!s.cpIsRequired)
            return;
        else {
            s.SetIsValid(false);
            e.isValid = false;
            e.errorText = "اجباری است";
            return;
        }
    }
    var val = e.value.split('/');
    if (val.length < 3) {
        s.SetIsValid(false);
        e.isValid = false;
        return;
    }
    val[0] = eval(val[0]);
    val[1] = eval(val[1]);
    val[2] = eval(val[2]);
    if (isNaN(val[0]) || isNaN(val[1]) || isNaN(val[2])) {
        s.SetIsValid(false);
        e.isValid = false;
        return;
    }

    if (val[0] < 1200 || val[0] > 1600 || val[1] < 1 || val[1] > 12 || val[2] < 1 || val[2] > 31) {
        s.SetIsValid(false);
        e.isValid = false;
        return;
    }
    if (val[1] > 6 && val[2] > 30) {
        s.SetIsValid(false);
        e.isValid = false;
        return;
    }
    if (val[1] == 12 && val[2] == 30 && !leap_persian(val[0])) {
        s.SetIsValid(false);
        e.isValid = false;
        return;
    }
};

function GetAge(birthdate) {

    var dateArray = birthdate.split('/');
    if (dateArray.length != 3)
        throw 'فرمت تاریخ اشتباه است';

    var year = parseInt(dateArray[0]);
    var month = parseInt(dateArray[1]);
    var day = parseInt(dateArray[2]);

    var today = new JalaliDate();

    var cYear = parseInt(today.getFullYear());
    var cMonth = parseInt(today.getMonth());
    var cDay = parseInt(today.getDay());

    if (cYear < year)
        throw 'سال تولد باید قبل از سال جاری باشد';

    var age = cYear - year;
    if (cMonth < month)
        age--;
    else if (cMonth == month && cDay < day)
        age--;

    return age;
};

function TryGetAge(brithdate) {
    var fnResult = { success: false, age: 0, error: '' };
    try {
        fnResult.age = GetAge(brithdate);
        fnResult.success = true;
    } catch (e) {
        fnResult.success = false;
        fnResult.error = e;
    }
    return fnResult;
};