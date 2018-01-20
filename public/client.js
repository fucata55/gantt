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

let theUser

let users = [
    {
        user: 'demo',
        password: 'demo'
    },
    {
        user: 'demo2',
        password: 'demo2'
    }
];

let projects = [];



let validateRegister = (username, password, confirm) => {
    console.log(`validateRegister of user: ${username}, password: ${password}, confirm: ${confirm}`);
    $('#passwordMustMatch').hide();
    $('#userAlreadyExist').hide();
    if (password !== confirm) {
        $('#passwordMustMatch').show();
        //        console.log('paswordvalidated')
    } else {
        let userData = {
            username: username,
            password: password
        };

        $.ajax({
                type: 'POST',
                url: '/register',
                dataType: 'json',
                data: JSON.stringify(userData),
                contentType: 'application/json'
            })
            //expect request POST will respond user data
            .done(function (result) {
                console.log(result);
                console.log('username is still unique');
                $('#landingPageRightSideRegister').hide();
                $('#welcomeBack').hide();
                $('#signIn').show();
                $('#landingPageRightSideSignin').show();
            })
            .fail(function (jqXHR, error, errorThrown) {
                $('#userAlreadyExist').show();
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
}

let validateSignIn = (signedInUser, signedInPassword) => {
    const userData = {
        username: signedInUser,
        password: signedInPassword
    };
    $.ajax({
            type: 'POST',
            url: '/signin',
            dataType: 'json',
            data: JSON.stringify(userData),
            contentType: 'application/json'
        }) //show login result
        .done(function (result) {
            theUser = result.username
            $('.user-name').text(theUser);
            $('.hideMe').hide();
            $('#homePage').show();
            $('header').show();
        })
        .fail(function (jqXHR, error, errorThrown) {
            $('#invalidUser').show();
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

let renderAProject = (newProject) => {
    $('#projectTable tr:last').after(`
<tr class='project'>
<td class='project-name'><span class='table-head-mobile'>Project Name: </span>${newProject.projectName}</td>
<td class='project-predeccesor'><span class='table-head-mobile'>Predecessor: </span>${newProject.projectPredeccesor}</td>
<td class='project-duration'><span class='table-head-mobile'>Duration: </span>${newProject.projectDuration}</td>
<td class='project-start'><span class='table-head-mobile'>Start Date: </span>${newProject.projectStart}</td>
<td class='project-end'><span class='table-head-mobile'>Finish Date: </span>${newProject.projectEnd}</td>
<td class='project-status'> <span class='table-head-mobile'>Status: </span>${newProject.projectStatus}</td>
</tr>
`)
}

let populateProjectSummary = (project) => {
    console.log('a')
    console.log('a')
}

//use variables and functions (triggers)

$('.scroll-js').click(function () {
    $('html,body').animate({
        scrollTop: $('#appDescription').offset().top
    }, 'slow');
});

$('.register-form').submit(function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    let registeredUser = $('#registeredUser').val();
    let registeredPassword = $('#registeredPassword').val();
    let registeredConfirmPassword = $('#registeredConfirmPassword').val();
    validateRegister(registeredUser, registeredPassword, registeredConfirmPassword)
})

$('.signin-form').submit(function (event) {
    event.preventDefault();
    let signedInUser = $('#signedInUser').val();
    let signedInPassword = $('#signedInPassword').val();
    validateSignIn(signedInUser, signedInPassword);
})


$('#newProjectJS').submit(function (event) {
    event.preventDefault();
    console.log('new project button triggers');
    console.log(
        $('#newProjectName').val()
    );
    let newProjectStart = $('#newProjectStart').val();
    let date = new Date(newProjectStart);
    let newProjectEnd = new Date(date);
    let newProjectDuration = parseInt($('#newProjectDuration').val());
    newProjectEnd.setDate(newProjectEnd.getDate() + newProjectDuration);
    let dd = newProjectEnd.getDate();
    if (dd < 10) {
        dd = '0' + dd;
    }
    let mm = newProjectEnd.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    let y = newProjectEnd.getFullYear();
    let formatedProjectEnd = mm + '/' + dd + '/' + y
    let newProject = {
        projectName: $('#newProjectName').val(),
        projectPredeccesor: $('#newProjectPredeccesor').val(),
        projectDuration: newProjectDuration,
        projectStart: $('#newProjectStart').val(),
        projectEnd: formatedProjectEnd,
        projectStatus: $('#status option:selected').val(),
        projectOwner: theUser
    };
    console.log(newProject);
    $.ajax({
            method: 'POST',
            url: '/user/project',
            dataType: 'json',
            data: JSON.stringify(newProject),
            contentType: 'application/json'
        })
        //POST will respond an empty note with unique ID
        .done(function (project) {
            renderAProject(project);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
})


//document ready trigger
$(function () {
    $('.hideMe').hide();
    $('#landingPage').show();
    $('#landingPageRightSideRegister').show();
    $('#newProjectStart').datepicker();
})

$('.navigate-register-link').click(function (event) {
    event.preventDefault();
    $('.hideMe').hide();
    $('#landingPage').show();
    $('#landingPageRightSideRegister').show()
});

$('.navigate-signin-link').click(function (event) {
    event.preventDefault();
    $('.hideMe').hide();
    $('#landingPage').show();
    $('#welcomeBack').show();
    $('#landingPageRightSideSignin').show()
})

$('#projectTable').on('click', '.project', (event) => {
    console.log('project trigger works');
    event.preventDefault();
    //    let selectedProjectName = $(event.target).closest('.project').find('.project-name').text();
    let selectedProject = {
        projectName: 'Project 1',
        projectPredeccesor: 'Predeccesor 1',
        projectDuration: '33',
        projectStart: '2018-04-20',
        projectEnd: '2018-5-23',
        projectStatus: 'canceled',
        projectOwner: theUser,
        projectTasks: []
    }
    $('.hideMe').hide();
    populateProjectSummary(selectedProject)
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
