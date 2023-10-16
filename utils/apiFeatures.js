class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const queryStr = JSON.stringify(queryObj);

    // {difficulty: 'easy', duration: {$gte: 5}}
    // {difficulty: 'easy', duration: {gte: '5'}}
    // gte, gt, lte, lt
    // (ex.) localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&sort=1&price[lt]=1500
    const queryStrMod = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryStrMod));

    return this;
  }

  sort() {
    // Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // default sorting
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // default field limiting
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // Pagination
    // (ex.) localhost:3000/api/v1/tours?page=2&limit=10
    const page = this.queryString.page * 1 || 1; // default page 1
    const limit = this.queryString.limit * 1 || 100; // default limit 100
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
