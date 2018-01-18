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
    //    console.log(`validateRegister of user: ${username}, password: ${password}, confirm: ${confirm}`);
    $('#passwordMustMatch').hide();
    $('#userAlreadyExist').hide();
    if (password !== confirm) {
        $('#passwordMustMatch').show();
        //        console.log('paswordvalidated')
    } else {
        let result = $.grep(users, function (e) {
            return e.user == username;
        });

        console.log(result)
        if (result.length !== 0) {
            $('#userAlreadyExist').show();
            //            console.log('username is exist');
        } else {
            console.log('username is still unique');
            users.push({
                user: username,
                password: password
            });
            $('#landingPageRightSideRegister').hide();
            $('#welcomeBack').hide();
            $('#signIn').show();
            $('#landingPageRightSideSignin').show();
        }
        //        console.log(users)
    }
}

let validateSignIn = (signedInUser, signedInPassword) => {
    //    console.log('validateSignIn Ran')
    let result = $.grep(users, function (e) {
        return e.user == signedInUser && e.password == signedInPassword;
    });
    console.log(result)
    if (result.length == 0) {
        //        console.log('user and password combination invalid');
        $('#invalidUser').show()
    } else {
        //        console.log('login successful');
        theUser = result[0].user;
        //        console.log(theUser);
        $('.user-name').text(theUser);
        $('.hideMe').hide();
        $('#homePage').show();
        $('header').show();
    }
}

let renderAProject = (newProject) => {
    $('#projectTable tr:last').after(`
<tr class='project'>
<td class='project-order'><span class='table-head-mobile'>ID: </span>${projects.length}</td>
<td class='project-name'><span class='table-head-mobile'>Project Name: </span>${newProject.projectName}</td>
<td><span class='table-head-mobile'>Predecessor: </span>${newProject.projectPredeccesor}</td>
<td><span class='table-head-mobile'>Duration: </span>${newProject.projectDuration}</td>
<td><span class='table-head-mobile'>Start Date: </span>${newProject.projectStart}</td>
<td><span class='table-head-mobile'>Finish Date: </span>${newProject.projectEnd}</td>
<td> <span class='table-head-mobile'>Status: </span>${newProject.projectStatus}</td>
</tr>
`)
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
    projects.push({
        projectName: $('#newProjectName').val(),
        projectPredeccesor: $('#newProjectPredeccesor').val(),
        projectDuration: $('#newProjectDuration').val(),
        projectStart: $('#newProjectStart').val(),
        projectEnd: $('#newProjectEnd').val(),
        projectStatus: $('#status option:selected').val(),
        projectOwner: theUser
    });
    console.log(projects[projects.length - 1]);
    renderAProject(projects[projects.length - 1]);
})


//document ready trigger
$(function () {
    $('.hideMe').hide();
    $('#landingPage').show();
    $('#landingPageRightSideRegister').show();
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
    let selectedProject = $(event.target).closest('.project-name').text();
    console.log(selectedProject);
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
