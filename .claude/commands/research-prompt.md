# /research-prompt

Create a comprehensive research prompt for a deep research agent.

## Context

The user wants to research the following topic or question:

```markdown
$ARGUMENTS
```

## Your Task

Generate a well-structured research prompt that will guide a research agent to provide actionable insights and recommendations.

## Instructions

1. **Analyze the request**: Consider the topic depth, complexity, and what type of research would be most valuable
2. **Structure the prompt**: Use the template below as a foundation, but adapt it to the specific research needs
3. **Define clear deliverables**: Specify what format and level of detail the research report should have
4. **Include project context**: Reference any relevant project information that would inform the research
5. **Wrap your final prompt**: Use five backticks to preserve nested formatting

## Essential Elements to Include

- **Clear research objectives** and success criteria
- **Relevant project context** and constraints
- **Specific questions** the research should answer
- **Deliverable format** with structure expectations
- **Citation requirements** for credible sources
- **Report formatting instruction**: "Wrap your report in a markdown code block with four backticks to preserve nested code blocks"

## Template Structure

`````markdown
# Deep Research: [Research Topic/Question]

## Research Objectives

[What should this research accomplish? What decisions will it inform?]

## Project Context

[Relevant background about the project, current state, constraints, goals]

## Research Questions

[Specific questions the research should answer - be concrete and actionable]

## Requirements

### [Category 1 - e.g., Technical Requirements]
[Specific requirements for this category]

### [Category 2 - e.g., Business Requirements] 
[Specific requirements for this category]

### [Additional categories as needed]

## Research Scope

[What should be included/excluded? Time constraints? Geographic focus? etc.]

## Deliverable Format

Please provide a comprehensive analysis with:

### [Section 1 - e.g., Executive Summary]
[What should this section contain and how detailed should it be?]

### [Section 2 - e.g., Analysis & Findings]
[What should this section contain and how detailed should it be?]

### [Section 3 - e.g., Recommendations]
[What should this section contain and how detailed should it be?]

### [Additional sections as needed]

## Success Criteria

The research should:
1. [Criterion 1]
2. [Criterion 2]
3. [Additional criteria]

## Citations & Sources

[Requirements for source quality, citations, and credibility standards]

**Important**: Wrap your report in a markdown code block with four backticks to preserve nested code blocks.

`````
