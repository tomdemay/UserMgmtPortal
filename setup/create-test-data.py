"""
This script is designed to create test data for the user data service.
It will call the randomuser.me REST API to retrieve random user data and then
parse the data and write it to a CSV file. The script will continue to call the
service until the desired number of records has been retrieved. The script will
also check for duplicates and will not write duplicate email addresses or SSNs
to the CSV file.
"""

import csv, requests, time, os, random, argparse
from datetime import datetime

# all valid US state abbreviations to map from full state name
state_abbreviations = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
}

# maintain a unique list of email addresses and SSNs to avoid duplicates
email_addresses = set()
ssns = set()

def load_existing_data(filename):
    """
    Load existing data from a CSV file
    filename: the name of the CSV file to load
    """
    if os.path.exists(filename):
        with open(filename, 'r', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            email_addresses.update([row['email'] for row in reader])
            ssns.update([row['ssn'] for row in reader])

def get_user_data() -> dict():
    """
    Make a request to the REST API and retrieve the JSON data for dummy user data
    Records fetch is limited to 5000 at a time or 2x the number of records needed
    returns: a dictionary of user data
    """
    to_fetch = min(5000, (needed - len(email_addresses)) * 2)
    print(f"retrieving {to_fetch} records...")
    # Make a request to the REST API and retrieve the JSON data
    response = requests.get(f'https://randomuser.me/api/?nat=us&exc=gender,login,registered,cell&noinfo&results={to_fetch}')
    if response.status_code != 200: 
        error = f"{response.text} ({response.status_code})"
        print(error)
        raise Exception(error)
    return response.json()

def parse_data(user_data) -> list():
    """
    Parse the incoming user data and return a list of dictionaries
    Duplicates have been eliminated and the data has been transformed
    user_data: the incoming user data
    returns: a list of dictionaries containing the parsed data
    """

    # Perform your desired manipulations on the user data
    parsed_data = []
    for user in user_data['results']:
        # Example manipulation: Extracting relevant fields
        email = user['email'] 
        ssn = user['id']['value']
        # if email and ssn doesn't already exist, add it to the list
        if email not in email_addresses and ssn not in ssns:
            new_data = {
                "firstName":   user['name']['first'],
                "lastName":    user['name']['last'], 
                "address":      f"{user['location']['street']['number']} {user['location']['street']['name']}", 
                "city":         user['location']['city'], 
                "state":        state_abbreviations[user['location']['state']],
                "zipcode":      user['location']['postcode'],
                "phone":        user['phone'] if random.random() > 0.4 else None,
                "email":        email, 
                "dob":          datetime.strptime(user['dob']['date'], "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%m/%d/%Y"), 
                "ssn":          ssn, 
                "picture":      user['picture']['large']
            }
            ssns.add(ssn)
            email_addresses.add(email)
            parsed_data.append(new_data)
            if len(email_addresses) == needed: break
        else:
            print(f"Duplicate email address or SSN found: {email} or {ssn}")

    return parsed_data

def write_data(data, filename, write_header):
    """
    Write the user data to a CSV file. If the file doesn't exist, create it otherwise append to it
    data: the user data to write
    filename: the name of the CSV file to write to
    write_header: whether or not to write the header row
    returns: nothing
    """
    global header_needed
    # Save the manipulated data to a CSV file
    keys = data[0].keys()
    with open(filename, "w" if write_header else 'a', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=keys)
        if write_header: 
            writer.writeheader()
            header_needed = False
        writer.writerows(data)

# The main program starts here
# setup argument parser
parser=argparse.ArgumentParser(
    description='Create test data for the user data service', 
    epilog='Example: python create-test-data.py --filename testdata/user_data.csv --needed 1000 --sleep 30', 
    formatter_class=argparse.ArgumentDefaultsHelpFormatter, 
    allow_abbrev=True, 
    add_help=True, 
    prefix_chars='-', 
    usage='%(prog)s [options]', 
    fromfile_prefix_chars='@'
)
parser.add_argument('-f', '--filename', help='the name of the CSV file to write to', default='user_data.csv')
parser.add_argument('-n', '--needed', help='the number of records needed', default=25000, type=int)
parser.add_argument('-s', '--sleep', help='the number of seconds to sleep between calls to the service. (records will be retrieve in batches of 5000)', default=45, type=int)
args = parser.parse_args()


filename = args.filename
needed = args.needed
sleep_seconds = args.sleep


print(f"reading existing email addresses from {filename}...")
load_existing_data(filename)
header_needed = len(email_addresses) ==  0
print(f"read {len(email_addresses):,} email addresses from {filename}")
print(f"collecting remaining {needed-len(email_addresses):,} records")
while(len(email_addresses) < needed):
    print(f"Calling service...")
    user_data = get_user_data()
    print(f"Received {len(user_data['results'])} users")
    print(f"Parsing records...")
    parsed_data = parse_data(user_data)
    print(f"Storing {len(parsed_data):,} records...")
    write_data(parsed_data, filename, header_needed)
    print(f"total records so far: {len(email_addresses):,}")
    if (len(email_addresses) >= needed): break
    print(f"Sleeping for {sleep_seconds} seconds before fetching more...")
    time.sleep(sleep_seconds)

print(f'Done... Data saved to {filename}.')
