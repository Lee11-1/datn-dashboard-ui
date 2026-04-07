const DEFAULT_PLACE = [
  [
    'Eastern Africa & Madagascar',
    '100000',
    'high_level_region'
  ],
  [
    'Egypt',
    '52',
    'high_level_region'
  ],
  [
    'Asia & Oceania',
    '100001',
    'high_level_region'
  ],
  [
    'South America',
    '100002',
    'high_level_region'
  ],
  [
    'Southern Africa',
    '100003',
    'high_level_region'
  ],
  [
    'Middle East',
    '100004',
    'high_level_region'
  ],
  [
    'Iceland & Greenland',
    '100005',
    'high_level_region'
  ],
]

export default DEFAULT_PLACE.map(([name, id, type]) => ({
  name,
  id,
  type
}))