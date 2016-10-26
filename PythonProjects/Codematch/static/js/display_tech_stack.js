function displayTechStack(tech_stack)
{
	var stack = JSON.stringify(tech_stack.replace(/&quot;/g, '"'));
	var stack_dict = {};
	stack_dict = JSON.parse(stack);
	var parsed = JSON.parse(stack_dict);
	for (var key in parsed) {
	  	var el = "<li class='tech-skill techSkill'>"
            +"<a class='btn btn-default btn-lg tech'><i class='devicon-"+key+"'></i><span key='"+key+"' class='network-name' >"+parsed[key]+"</span></a>"
                  +"</li>";
        $(".tech-stack-holder").append(el);
	};
}
