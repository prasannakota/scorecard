<!DOCTYPE html>
<html>
<head>
    <title>Assessment Question</title>
</head>
<body>
<h2>{{ $question->question_text }}</h2>
<form method="POST" action="{{ url('/assessment/answer/' . $question->id) }}">
    @csrf
    <label><input type="radio" name="selected_option" value="a"> {{ $question->option_a }}</label><br>
    <label><input type="radio" name="selected_option" value="b"> {{ $question->option_b }}</label><br>
    <label><input type="radio" name="selected_option" value="c"> {{ $question->option_c }}</label><br>
    <label><input type="radio" name="selected_option" value="d"> {{ $question->option_d }}</label><br>
    <label><input type="radio" name="selected_option" value="e"> {{ $question->option_e }}</label><br>
    <button type="submit">Next</button>
</form>
</body>
</html>
