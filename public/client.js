//Define variables and functions
Highcharts.chart('container', {
    chart: {
        type: 'xrange'
    },
    title: {
        text: 'Pro players Soccer Game'
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: {
            text: ''
        },
        categories: ['Planning', 'Development', 'Testing'],
        reversed: true
    },
    series: [{
        name: 'Project 1',
        // pointPadding: 0,
        // groupPadding: 0,
        borderColor: 'gray',
        pointWidth: 20,
        data: [{
            x: Date.UTC(2014, 10, 21),
            x2: Date.UTC(2014, 11, 2),
            y: 0
        }, {
            x: Date.UTC(2014, 11, 2),
            x2: Date.UTC(2014, 11, 5),
            y: 1
        }, {
            x: Date.UTC(2014, 11, 8),
            x2: Date.UTC(2014, 11, 9),
            y: 2
        }, {
            x: Date.UTC(2014, 11, 9),
            x2: Date.UTC(2014, 11, 19),
            y: 1
        }, {
            x: Date.UTC(2014, 11, 10),
            x2: Date.UTC(2014, 11, 23),
            y: 2
        }],
        dataLabels: {
            enabled: false
        }
    }]

});

//use variables and functions (triggers)


//document ready trigger
$(function () {
    $('.hideMe').hide();
    $('#landingPage').show();
    $('#landingPageRightSideRegister').show();
})


$('.register-form').submit(function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    $('.hideMe').hide();
    $('#landingPage').show();
    $('#landingPageRightSideSignin').show()
})

$('.navigate-register-link').click(function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    $('.hideMe').hide();
    $('#landingPage').show();
    $('#landingPageRightSideRegister').show()
});

$('.signin-form').submit(function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    $('.hideMe').hide();
    $('#homePage').show();
    $('header').show();
})

$('.navigate-signin-link').click(function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    $('.hideMe').hide();
    $('#landingPage').show();
    $('#landingPageRightSideSignin').show()
})

$('.project').click(function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    $('.hideMe').hide();
    $('#projectSection').show();
    $('header').show()
});


$('.signout').click(function (event) {
    event.preventDefault();
    location.reload();
})

$('#navigateHome').click(function (event) {
    event.preventDefault();
    $('.hideMe').hide();
    $('#homePage').show();
    $('header').show();
});
