//Define variables and functions
let theUser
let theProjectId

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
            getProjects(theUser);
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

//create new project
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

$('#newTaskJS').submit(event => {
    event.preventDefault();
    console.log('new task button triggers');
    console.log(
        $('#newTaskName').val()
    );
    let newTaskStart = $('#newTaskStart').val();
    let date = new Date(newTaskStart);
    let newTaskEnd = new Date(date);
    let newTaskDuration = parseInt($('#newTaskDuration').val());
    newTaskEnd.setDate(newTaskEnd.getDate() + newTaskDuration);
    let dd = newTaskEnd.getDate();
    if (dd < 10) {
        dd = '0' + dd;
    }
    let mm = newTaskEnd.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    let y = newTaskEnd.getFullYear();
    let formatedTaskEnd = mm + '/' + dd + '/' + y
    let newTask = {
        taskName: $('#newTaskName').val(),
        taskPredeccesor: $('#newTaskPredeccesor').val(),
        taskDuration: newTaskDuration,
        taskStart: $('#newTaskStart').val(),
        taskEnd: formatedTaskEnd,
        taskStatus: $('#newTaskStatus option:selected').val(),
        taskOwner: theProjectId
    };
    console.log(newTask);
    $.ajax({
            method: 'POST',
            url: '/user/project/task',
            dataType: 'json',
            data: JSON.stringify(newTask),
            contentType: 'application/json'
        })
        //POST will respond an empty note with unique ID
        .done(task => {
            console.log(task)
            renderATask(task);
        })
        .fail((jqXHR, error, errorThrown) => {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
})

let getAProject = projectId => {
    $.ajax({
            type: 'GET',
            url: '/user/project/' + projectId
        })
        .done(project => {
            console.log(project);
            $('#projectSection h1').text(project[0].projectName)
        })
        .fail((jqXHR, error, errorThrown) => {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

let getProjects = username => {
    $('.project').remove();
    $.ajax({
            type: 'GET',
            url: '/user/project/all/' + username
        })
        .done(projects => {
            projects.forEach(project => renderAProject(project))

        })
        .fail((jqXHR, error, errorThrown) => {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

let getTasks = projectId => {
    $('.task').remove();
    $.ajax({
            type: 'GET',
            url: '/user/project/task/all/' + theProjectId
        })
        .done(tasks => {
            console.log('getTasks successful', tasks)
            tasks.forEach(task => renderATask(task))
        })
        .fail((jqXHR, error, errorThrown) => {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

let renderAProject = (project) => {
    $('#projectTable tr:last').after(`
            <tr class='project' id='${project._id}'>
                <td class='project-name'><span class='table-head-mobile'>Project Name: </span>${project.projectName}</td>
                <td class='project-predeccesor'><span class='table-head-mobile'>Predecessor: </span>${project.projectPredeccesor}</td>
                <td class='project-duration'><span class='table-head-mobile'>Duration: </span>${project.projectDuration}</td>
                <td class='project-start'><span class='table-head-mobile'>Start Date: </span>${project.projectStart}</td>
                <td class='project-end'><span class='table-head-mobile'>Finish Date: </span>${project.projectEnd}</td>
                <td class='project-status'> <span class='table-head-mobile'>Status: </span>${project.projectStatus}</td>
            </tr>
        `)
}

let renderATask = (newTask) => {
    console.log(`renderATask ran. the new task is ${newTask.taskName}, ${newTask.taskPredeccesor}, ${newTask.taskStatus}`);
    $('#taskTable tr:last').after(`
    <tr>
        <td colspan='7'>
            <form action="" class='project-form seamless-form task' id='${newTask._id}'>
                <input class="longer-input a task-name" type="text" value='${newTask.taskName}' required>
                    <input class="longer-input b" type="text" value='${newTask.taskPredeccesor}' required>
                    <input class="shorter-input c" type="text" value='${newTask.taskDuration}' required>
                    <input class="shorter-input d" type="text" value='${newTask.taskStart}' required>
                    <input class="shorter-input d" type="text" value='${newTask.taskEnd}' required>
                    <select name="status" id="taskStatus" required>
                        <option value="Planning">Planning</option>
                        <option value="On Going">On Going</option>
                        <option value="Paused">Paused</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button class='mini-button'><img src="./edit-icon.png" alt=""></button>
                    <button class='mini-button' id='deleteButton'><img src="./trash-icon.png" alt="trash"></button>
            </form>
        </td>
    </tr>
`);
    //$("#taskStatus").val(newTask.taskStatus);
    $('#taskTable tr:last').find('select').val(newTask.taskStatus);
}

//populate project summary at project summary form
let populateProjectSummary = (project) => {
    $.ajax({
            method: 'GET',
            url: '/user/project/' + project
        })
        .done(project => {
            showChart(project);
            console.log('populateProjectSummary ran', project[0]);
            $('#projectSection h1').text(project[0].projectName);
            $('.project-summary').attr('id', project[0]._id);
            $('#projectName').val(project[0].projectName);
            $('#projectPredeccesor').val(project[0].projectPredeccesor);
            $('#projectDuration').val(project[0].projectDuration);
            $('#projectStart').val(project[0].projectStart);
            $('#projectEnd').val(project[0].projectEnd);
            $('#projectStatus').val(project[0].projectStatus);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}


//update project
$('.project-summary').submit(function (event) {
    event.preventDefault();
    console.log('project summary button triggers');
    console.log(
        $('.project-summary').attr('id')
    );
    let projectStart = $('#projectStart').val();
    let date = new Date(projectStart);
    let projectEnd = new Date(date);
    let projectDuration = parseInt($('#projectDuration').val());
    projectEnd.setDate(projectEnd.getDate() + projectDuration);
    let dd = projectEnd.getDate();
    if (dd < 10) {
        dd = '0' + dd;
    }
    let mm = projectEnd.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    let y = projectEnd.getFullYear();
    let formatedProjectEnd = mm + '/' + dd + '/' + y
    let project = {
        _id: $('.project-summary').attr('id'),
        projectName: $('#projectName').val(),
        projectPredeccesor: $('#projectPredeccesor').val(),
        projectDuration: projectDuration,
        projectStart: $('#projectStart').val(),
        projectEnd: formatedProjectEnd,
        projectStatus: $('#projectStatus option:selected').val(),
        projectOwner: theUser
    };
    console.log(project);
    $.ajax({
            method: 'PUT',
            url: '/user/project/' + project._id,
            dataType: 'json',
            data: JSON.stringify(project),
            contentType: 'application/json'
        })
        .done(aproject => {
            //update chart details accordingly
            console.log('change project summary success');
            getAProject(project._id);
        })
        .fail((jqXHR, error, errorThrown) => {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
})

let showChart = (project, tasks) => {
    console.log('showChart ran', project);
    let aproject = project[0];
    Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: aproject.projectName
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: ['test', 'Planning', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            //name: 'Project 1',
            // pointPadding: 0,
            // groupPadding: 0,
            borderColor: 'gray',
            pointWidth: 20,
            data: [{
                x: Date.UTC(2014, 10, 01),
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
            }, {
                x: Date.UTC(2014, 11, 10),
                x2: Date.UTC(2014, 11, 23),
                y: 3
            }],
            dataLabels: {
                enabled: false
            }
        }]
    })
};

let deleteProject = projectIdToDelete => {
    $.ajax({
            type: 'DELETE',
            url: '/user/project/' + projectIdToDelete
        })
        .done(() => {
            console.log(`project ${projectIdToDelete} is successfully deleted`);
            $('.hideMe').hide();
            getProjects(theUser);
            $('#homePage').show();
            $('header').show();
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

//document ready trigger
$(function () {
    $('.hideMe').hide();
    $('#landingPage').show();
    $('#landingPageRightSideRegister').show();
    $('#newProjectStart').datepicker();
    $('#newTaskStart').datepicker();
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
    let selectedProjectId = $(event.target).closest('.project').attr('id');
    //    console.log(selectedProjectId)
    theProjectId = selectedProjectId;
    console.log(`theProjectId is ${theProjectId}`);
    $('.hideMe').hide();
    populateProjectSummary(selectedProjectId)
    getTasks(theProjectId);
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
    getProjects(theUser);
    $('#homePage').show();
    $('header').show();
});

$('#deleteProjectButton').click(event => {
    let projectIdToDelete = $(event.target).closest('.center').find('.project-summary').attr('id');
    console.log('delete trigger', projectIdToDelete);
    deleteProject(projectIdToDelete);
})
