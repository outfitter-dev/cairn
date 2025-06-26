<!-- Test file for legacy waymark patterns -->
# Legacy Waymark Patterns

This file contains examples of legacy waymark patterns that should be detected by the audit script.

<!-- V1 Syntax Violations -->
<!-- todo ::: test legacy +tag syntax +security -->
<!-- fixme ::: test property-based priority priority:high -->
<!-- note ::: test missing hash in reference fixes:123 -->
<!-- todo ::: test discouraged hierarchical tag #auth/google -->
<!-- FIXME ::: test all-caps marker -->

<!-- Legacy Blessed Properties -->
<!-- note ::: test legacy blessed property reason:test_reason -->
<!-- todo ::: test legacy blessed property since:v1.0 -->

<!-- Non-blessed properties -->
<!-- review ::: test non-blessed property custom:value -->

<!-- Arrays with spaces -->
<!-- todo ::: test array with spaces #cc:@alice, @bob -->

<!-- Multiple ownership/cc tags -->
<!-- refactor ::: test multiple ownership tags #owner:@alice #owner:@bob -->
<!-- alert ::: test multiple cc tags #cc:@security #cc:@ops --> 