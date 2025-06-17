import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class WaymarkSpec {
  constructor() {
    const specPath = path.join(__dirname, 'waymark-spec.json');
    this.spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  }

  // Getters for easy access
  get officialMarkers() {
    return new Set(Object.values(this.spec.markers.official).flat());
  }

  get deprecatedMarkers() {
    return new Set(Object.values(this.spec.markers.deprecated).flat());
  }

  get allRelationalTags() {
    return new Set(Object.values(this.spec.relational_tags).flat());
  }

  get legacyProperties() {
    return new Set(this.spec.legacy_properties.deprecated);
  }

  get arrayAllowedTags() {
    return new Set(this.spec.relational_tags.arrays_allowed);
  }

  // Validation methods
  isOfficialMarker(marker) {
    return this.officialMarkers.has(marker);
  }

  isDeprecatedMarker(marker) {
    return this.deprecatedMarkers.has(marker);
  }

  isRelationalTag(tag) {
    return this.allRelationalTags.has(tag);
  }

  isLegacyProperty(prop) {
    return this.legacyProperties.has(prop);
  }

  getBlazeTagFor(issue, type = 'fix') {
    const tags = this.spec.blaze_tags[type] || this.spec.blaze_tags.fix;
    for (const [suffix, description] of Object.entries(tags)) {
      if (issue.toLowerCase().includes(description.toLowerCase())) {
        return `wm:${type}/${suffix}`;
      }
    }
    return `wm:${type}/unknown`;
  }

  // Validation rule checkers
  shouldRequireHashPrefix(context) {
    return this.spec.validation_rules.require_hash_prefix[context] || false;
  }

  isForbiddenPattern(pattern) {
    return this.spec.validation_rules.forbidden_patterns[pattern] || false;
  }

  isValidActorPosition(position) {
    return this.spec.validation_rules.actor_placement.valid_positions.includes(position);
  }

  getRelationalTagsWithActors() {
    return new Set(this.spec.validation_rules.actor_placement.relational_tags_with_actors);
  }
}

export default WaymarkSpec; 